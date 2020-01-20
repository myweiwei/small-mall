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
      var orderNo = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/mine/order/orderdetail/orderdetail?orderNo=' + orderNo
      })
  },
  deleteOrder: function (event) {
    console.log(1);
    let me = this;
    wx.showModal({
      title: '提示',
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
          console.log('用户点击取消')
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
              me.getData(payStatus, data.data.data);
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
  onChange(event)
  {
    var that = this;
    switch (event.detail.name)
    {
      case 1:
        that.payStatus = 0;//0未付款
        break;
      case 2:
        that.payStatus = 1;//1已付款的，等待发货和收货
        break;
      case 3:
        that.payStatus = 3;//3已签收，订单完成
        break;
      case 4:
        that.payStatus = -4;//-4订单已取消
        break;
      default:
        that.payStatus = "";
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
        me.setDatame.setData({
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
              console.log(res.data);
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) { }
          })
      }
    })
  }
})