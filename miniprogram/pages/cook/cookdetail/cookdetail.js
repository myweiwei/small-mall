const app = getApp();
Page({

  data: {
   cook:[]
  },
  onLoad:function(options){
    console.log(options.productId);
    var me = this;
    wx.request({
      url: app.baseUrl + '/manager/cook',
      method: "GET",
      data:{productId:21},
      success: function (res) {
       
        //遍历所有material的key
        var key = "";
        for(var i = 0; i < res.data.data.length; i++){
          // console.log(res.data.data[i].material);
          var obj = JSON.parse(res.data.data[i].material);
          key = "";
          for(var k in obj){
            key += (k + "  ，");
          }
          key = key.substr(0,key.length - 1);
          console.log(key);
          res.data.data[i].materialKey = key;
        }
        me.setData({
          cook: res.data.data
        })
      }
    });
  }
})