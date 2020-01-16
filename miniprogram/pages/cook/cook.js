const app = getApp();
Page({

  data: {
   products:[]
  },
  onLoad:function(){
    var me = this;
    wx.request({
      url: app.baseUrl + '/products',
      method: "GET",
      success: function (data) {
        console.log(data.data.data);
        me.setData({
          products: data.data.data
        })
      }
    });
  }
})