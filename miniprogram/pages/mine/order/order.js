const app = getApp();
Page({ 
  data: {
    active: 0,
    list:[],
    id:'',
    userId:'',
    payStatus:''
  },

  goOrderDetail:function(event)
  {
    let me=this;
    var orderNo = event.currentTarget.dataset.id;
    wx.navigateTo({ 
      url: '/pages/mine/order/orderdetail/orderdetail?orderNo=' + orderNo + '&payStatus='+me.data.payStatus
    })
  },
  deleteOrder: function (event) {
    let me = this;
    wx.showModal({
      title: '',
      content: '是否删除该订单',
      success(res) {
        if (res.confirm) {
          var orderNo = event.currentTarget.dataset.id;
          wx.request({
            url: app.baseUrl + '/order',
            data: {
              userId: me.data.userId,
              orderNo: orderNo
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'DELETE',
            success(res) {
              me.getUser(me.data.payStatus);
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  getUser: function (payStatus) {
    var me = this;
    wx.showLoading({
      title: '加载中',
    }),
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
              me.setData({
                userId: data.data.data
              })
              me.getData(me.data.payStatus, data.data.data);
            },
            error: function (err) {
            }
          })
        } else {
        }
      }
    });
  },
  onChange(event)
  {
    var that = this;
    switch (event.detail.name)
    {
      case 1:
        that.setData({
          payStatus:0
        })
        break;
      case 2:
        that.setData({
          payStatus: 1
        });//1已付款的，等待发货和收货
        break;
      case 3:
        that.setData({
          payStatus: 3
        });//3已签收，订单完成
        break;
      case 4:
        that.setData({
          payStatus: -4
        });//-4订单已取消
        break;
      default:
        that.setData({
          payStatus:''
        })
        //全部，不传
        break;
    }
    that.getUser(that.payStatus);
  },
  getPayStatus(id){
    let me=this;
    switch (id) {
      case 'unPayClick':
        me.setData({ 
          active: 1 
        });//0未付款
        break;
      case 'send':
        me.setData({ 
          active: 2
        });//1已付款的，等待发货和收货
        break;
      case 'say':
        me.setData({
          active: 3
        });//3已签收，订单完成
        break;
      case 'myOrder':
        //全部订单不用传
        me.setData({ 
          active: 0,
          payStatus: ''
        });
        break;
      case 'cancel':
        //全部订单不用传
        me.setData({ 
          active: 4
        });
        break;
    }
  },
  getData: function (payStatus,userId){
    let that=this;
    wx.request({
      url: app.baseUrl + '/orderList',
      data:{
        userId: userId,
        status:payStatus
      },
      method:'GET',
      success(res) {
        for (let i = 0; i < res.data.data.length;i++){
          res.data.data[i].zs = app.getPrice(res.data.data[i].price).zs;
          res.data.data[i].xs = app.getPrice(res.data.data[i].price).xs;
        }
        that.setData({ list: res.data.data });
        wx.hideLoading();
      }
    })
  },
  onLoad: function (options) {
      //根据用户点击的是什么按钮，决定加载到哪个页面
      var that = this;
      that.setData({
        id:options.id
      })
  },
  onShow: function (){
    let that=this;
    that.getPayStatus(that.data.id);
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    that.setData({
      payStatus: currPage.data.payStatus ? currPage.data.payStatus:""
    })
    that.getUser(currPage.data.payStatus);
  },
  payOrder:function(event){
    var that = this;
    wx.request({
      url: app.baseUrl + '/payOrder',
      data: {
        userId: that.data.userId,
        orderNo: event.currentTarget.dataset.id
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
                data:{
                  orderNo: event.currentTarget.dataset.id
                },
                method:'GET',
                success(res) {
                  that.getData(that.data.payStatus,that.data.userId);
                }
              });
            },
            fail: function (res) {
            },
            complete: function (res) { }
          })
      }
    })
  }
})