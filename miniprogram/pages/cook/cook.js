const app = getApp();
Page({

  data: {
   products:[]
  },
  goCookList:function(event){
    var productId = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/cook/cooklist/cooklist?productId=' + productId
        })
  },
  onLoad:function(){
    var me = this;
    wx.request({
      url: app.baseUrl + '/products',
      method: "GET",
      success: function (data) {
        me.setData({
          products: data.data.data
        })
      }
    });
  }
})