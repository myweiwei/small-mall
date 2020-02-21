const app = getApp();
var orderNo;
Page({ 
  data: {
    userId:0,
    active: 0,
    obj:{},
    time:0, //倒计时剩余时间
    timeData:{},//onChange方法取time的时间，给timeData用
    orderNo:""
  },

  onChange(e) {
    var that = this;
    if(e.detail.hours == 0 && e.detail.minutes == 0 && e.detail.seconds == 0){
      //重新加载该订单状态
      wx.request({
        url: app.baseUrl + '/order',
        data: {
          orderNo: orderNo
        },
        method: 'GET',
        success(res) {
          console.log("订单支付时间超时，重新请求数据刷新页面" + res.data.data);
          getData(res, that);
        }
      })
      
    }
    this.setData({
      timeData: e.detail
    });
    console.log(e.detail);
  },

  onLoad: function (options) {
      var that = this;
      orderNo = options.orderNo;
      that.setData({
        orderNo: orderNo
      });
      wx.login({
        success(res) {
          if (res.code) {
            //通过wx.login内置函数，得到临时code码
            wx.request({
              url: app.baseUrl + '/openIdSessionKey',
              method: "get",
              data: {
                code: res.code
              },
              success: function (data) {
                that.setData({
                  userId: data.data.data,
                  showLoad: false
                });
               
                wx.request({
                  url: app.baseUrl + '/order',
                  data:{
                    orderNo:orderNo
                  },
                  method:'GET',
                  success(res) {
                    getData(res,that);
                    console.log(res.data.data + "----------------------");
                  }
                });
              },
              error: function (err) {
                console.log(err);
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
     
  },
  cancelOrder: function(){
    var that = this;

    wx.showModal({
      title: '提示',
      content: '是否删除该订单',
      success(res) {
        if (res.confirm) {
          var orderNo = that.data.orderNo;
          wx.request({
            url: app.baseUrl + '/cancelOrder',
            data: {
              userId: that.data.userId,
              orderNo: orderNo
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            success(res) {
              wx.request({
                url: app.baseUrl + '/order',
                data: {
                  orderNo: orderNo
                },
                method: 'GET',
                success(res) {
                  wx.navigateTo({
                    url: '/pages/mine/order/order'
                  })
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


   
  },
  deleteOrder: function(){
    var that = this;
    wx.request({
      url: app.baseUrl + '/order',
      data: {
        userId: that.data.userId,
        orderNo: orderNo
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'DELETE',
      success(res) {
        wx.request({
          url: app.baseUrl + '/order',
          data: {
            orderNo: orderNo
          },
          method: 'GET',
          success(res) {
            getData(res, that);
          }
        })
      }
    })
  },
  payOrder:function(){
    var that = this;
    wx.request({
      url: app.baseUrl + '/payOrder',
      data: {
        userId: that.data.userId,
        orderNo: orderNo
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      success(res) {
        var obj = JSON.parse(res.data.data);
        wx.requestPayment(
          {
            timeStamp: obj.timeStamp,
            nonceStr: obj.nonceStr,
            package: obj.package,
            signType: obj.signType,
            paySign: obj.paySign,
            success: function (res) {
              wx.request({
                url: app.baseUrl + '/order',
                data: {
                  orderNo: orderNo
                },
                method: 'GET',
                success(res) {
                  getData(res, that);
                }
              })
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) { }
          })
      }
    })
  },
  finishOrder:function(){
    wx.showModal({
      title: '提示',
      content: '是否确认收到货物？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.baseUrl + '/finishOrder',
            data: {
              orderNo: orderNo
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            success(res) {
              wx.request({
                url: app.baseUrl + '/order',
                data: {
                  orderNo: orderNo
                },
                method: 'GET',
                success(res) {
                  getData(res, that);
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})

function getData(res,that) {
  var order = res.data.data;
  that.setData({ time: order.waitPayTime });

  var a = ((order.price + order.expressPrice) / 100).toFixed(2).split('.');
  order.zs = a[0];
  order.xs = a[1];

   var addresses = order.namePhoneAddress.split(";");
   order.name = addresses[0];
   order.phone = addresses[1];
   order.province = addresses[2];
   order.neighbourhood = addresses[3];

  var orderDetail = res.data.data.orderItem;
  for (let i = 0; i < orderDetail.length; i++) {
    var totalPrice = orderDetail[i].totalPrice;
    var b = (totalPrice / 100).toFixed(2).split('.');
    orderDetail[i].zs = b[0];
    orderDetail[i].xs = b[1];

   
  }

  that.setData({ obj: res.data.data });
  console.log(res.data.data);
}