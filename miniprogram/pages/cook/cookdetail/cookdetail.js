const app = getApp();
Page({

  data: {
   cook:{},
   materialFormat:[]
  },
    onLoad: function(options) {
      var me = this;
      wx.request({
        url: app.baseUrl + '/manager/cookDetail',
        method: "GET",
        data: { cookId: options.cookId},
        success: function (res) {    
          res.data.data.materialFormat = me.jsonFormat(res.data.data.material);
          res.data.data.stepFormat = me.jsonFormat(res.data.data.step);
          me.setData({
            cook:res.data.data
          });
        }
      });
    },

    //json字符串转键值对数组
    jsonFormat:function (jsonStr){
      var materailArr = new Array();
      var obj = JSON.parse(jsonStr);
      for (var k in obj) {
        var value = obj[k];
        materailArr.push({ k, value});
      }
      return materailArr;
    }
})