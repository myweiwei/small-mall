const app = getApp();
Page({

  data: {
   products:[]
  },
  goCookDetail:function(event){
   
    var productId = event.currentTarget.dataset.id;
    console.log(productId);
        wx.navigateTo({
            url: '/pages/cook/cookdetail/cookdetail?productId=' + productId
        })
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