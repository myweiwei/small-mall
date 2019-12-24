const app = getApp();
Page({ 
  data: {
    active: 0,
    list:[]
  },

  onLoad: function (options) {
      //根据用户点击的是什么按钮，决定加载到哪个页面
      var that = this;
      var id = options.id;
      var payStatus = 0;
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