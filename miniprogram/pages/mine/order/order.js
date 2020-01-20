const app = getApp();
Page({ 
  data: {
    active: 0,
    list:[],
    id:'',
    payStatus:'',
    userId:'',
  },

  goOrderDetail:function(event)
  {
      var orderNo = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/mine/order/orderdetail/orderdetail?orderNo=' + orderNo
      })
  },
  deleteOrder: function (event) {
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
              userId: 288,
              orderNo: orderNo
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'DELETE',
            success(res) {
              me.getData();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getUser: function () {
    var me = this;
    wx.login({
      success(res) {
        if (res.code) {
          //通过wx.login内置函数，得到临时code码
          wx.request({
            url: me.data.baseUrl + '/openIdSessionKey',
            method: "get",
            data: {
              code: res.code
            },
            success: function (data) {
              console.log(data.data.data);
              me.setData({
                userId: data.data.data
              })
              // wx.nextTick(() =>{
              //   me.getPayStatus(me.data.id);
              // })
            },
            error: function (err) {
              console.log(err);
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
    var tabName = event.detail.name;
    var payStatus;
    console.log(tabName);
    switch(tabName)
    {
      case 1:
        payStatus = 0;//0未付款
        that.setData({
          id:'unPayClick'
        })
        break;
      case 2:
        payStatus = 1;//1已付款的，等待发货和收货
        that.setData({
          id: 'send'
        })
        break;
      case 3:
        payStatus = 3;//3已签收，订单完成
        that.setData({
          id: 'say'
        })
        break;
      case 4:
        payStatus = -4;//-4订单已取消
        that.setData({
          id: 'cancel'
        })
        break;
      default:
        payStatus = "";
        that.setData({
          id: 'myOrder'
        })
        //全部，不传
        break;
    }
    that.getData(payStatus);
  },
  getPayStatus(id){
    let me=this;
    console.log(id);
    switch (id) {
      case 'unPayClick':
        me.setData({ 
          active: 1 ,
          payStatus:0
        });//0未付款
        break;
      case 'send':
        me.setData({ 
          active: 2,
          payStatus: 1 
        });//1已付款的，等待发货和收货
        break;
      case 'say':
        me.setDatame.setData({
          active: 3,
          payStatus: 3
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
        me.setData({ active: 4 });
        break;
    }
    console.log(me.data.payStatus);
    me.getData(me.data.payStatus);
  },
  getData: function (payStatus){
    let that=this;
    wx.showLoading({
      title: '加载中',
    }),
    wx.request({
      url: app.baseUrl + '/orderList',
      data:{
        userId:that.data.userId,
        status:payStatus
      },
      method:'GET',
      success(res) {
        wx.hideLoading();
        for (let i = 0; i < res.data.data.length;i++){
          res.data.data[i].zs = app.getPrice(res.data.data[i].price).zs;
          res.data.data[i].xs = app.getPrice(res.data.data[i].price).xs;
        }
        that.setData({ list: res.data.data });
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
    that.getUser();
  }
})