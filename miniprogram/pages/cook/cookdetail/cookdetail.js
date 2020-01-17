const app = getApp();
Page({

  data: {
   cook:{},
   materialFormat:[]
  },
    onLoad: function(options) {
      console.log(options.cookId);
      var me = this;
      wx.request({
        url: app.baseUrl + '/manager/cookDetail',
        method: "GET",
        data: { cookId: options.cookId},
        success: function (res) {
          console.log(res.data.data);
          //遍历原料，存储成键值对形式，保存到数据中
          var materailArr = new Array();
          var obj = JSON.parse(res.data.data.material);
          for (var k in obj) {
            var value = obj[k];
            materailArr.push({ k, value});
          }
          
          console.log(materailArr + ".............");
          res.data.data.materialFormat = materailArr;
        
          
          me.setData({
            cook:res.data.data


          });
        }
      });
    }
})