const app = getApp();
Page({

  data: {
   cook:[]
  },
  goCookDetail: function (event) {
    var cookid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/cook/cookdetail/cookdetail?cookId=' + cookid
    })
  },
  onLoad:function(options){
    var me = this;
    wx.request({
      url: app.baseUrl + '/manager/cook',
      method: "GET",
      data:{productId:options.productId},
      success: function (res) {
       
        //遍历所有material的key
        var key = "";
        for(var i = 0; i < res.data.data.length; i++){
          var obj = JSON.parse(res.data.data[i].material);
          key = "";
          for(var k in obj){
            key += (k + "  ，");
          }
          key = key.substr(0,key.length - 1);
          res.data.data[i].materialKey = key;
        }
        me.setData({
          cook: res.data.data
        })
      }
    });
  }
})