const app = getApp();
Page({ 
  data: {
    active: 0,
    obj:{}
  },

  onLoad: function (options) {
      var that = this;
      var orderNo = options.orderNo;
      wx.request({
        url: app.baseUrl + '/order',
        data:{
          orderNo:orderNo
        },
        method:'GET',
        success(res) {
          var order = res.data.data;
          var a = (order.price / 100).toFixed(2).split('.');
          order.zs = a[0];
          order.xs = a[1];


          var orderDetail = res.data.data.orderItem;
          for(let i = 0; i < orderDetail.length; i++)
          {
            var totalPrice = orderDetail[i].totalPrice;
            var b = (totalPrice / 100).toFixed(2).split('.');
            orderDetail[i].zs = b[0];
            orderDetail[i].xs = b[1];
          }
          
          that.setData({obj:res.data.data});
          console.log(res.data.data);
        }
      })
  }
})