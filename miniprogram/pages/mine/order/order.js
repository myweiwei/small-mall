const app = getApp();
Page({ 
  data: {
    active: 0,
    list:[]
  },

  goOrderDetail:function(event)
  {
      console.log(event.currentTarget.dataset.id);
      var orderNo = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/mine/order/orderdetail/orderdetail?orderNo=' + orderNo
      })
  },

  onChange(event)
  {
    var that = this;
    var tabName = event.detail.name;
    console.log(tabName);
    var payStatus;
    switch(tabName)
    {
      case 1:
        payStatus = 0;//0未付款
        break;
      case 2:
        payStatus = 1;//1已付款的，等待发货和收货
        break;
      case 3:
        payStatus = 3;//3已签收，订单完成
        break;
      case 4:
        payStatus = -4;//-4订单已取消
        break;
      default:
        payStatus = "";
        //全部，不传
        break;
    }
    wx.request({
      url: app.baseUrl + '/orderList',
      data:{
        userId:288,
        status:payStatus
      },
      method:'GET',
      success(res) {
        for (let i = 0; i < res.data.data.length;i++){
          res.data.data[i].price =( res.data.data[i].price/100).toFixed(2);
          var b = res.data.data[i].price.split(".");
          res.data.data[i].zs = b[0];
          res.data.data[i].xs = b[1];
        }
        that.setData({ list: res.data.data });
      }
    })
  },

  onLoad: function (options) {
      //根据用户点击的是什么按钮，决定加载到哪个页面
      var that = this;
      var id = options.id;
      var payStatus = "";
      switch(id) {
        case 'unPayClick':
          this.setData({active:1});
          payStatus = 0;//0未付款
          break;
        case 'send':
          this.setData({active:2});
          payStatus = 1;//1已付款的，等待发货和收货
          break;
        case 'say':
          this.setData({active:3});
          payStatus = 3;//3已签收，订单完成
          break;
        case 'myOrder':
          //全部订单不用传
          this.setData({active:0});
          break;
      }
      console.log(payStatus);
      wx.request({
        url: app.baseUrl + '/orderList',
        data:{
          userId:288,
          status:payStatus
        },
        method:'GET',
        success(res) {
          that.setData({list:res.data.data});
            console.log(res.data.data);
        }
      })
  }
})