const app = getApp();
var orderNo;
Page({
  data: {
    addressDate:[],
    chooseAddress:{}
  },

  getUser: function () {
    let me = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success(res) {
        if (res.code) {
          //通过wx.login内置函数，得到临时code码
          wx.request({
            url: app.baseUrl + '/openIdSessionKey',
            method: "get",
            data: {
              code: res.code
            },
            success: function (data) {
              me.setData({
                userId: data.data.data
              })
              me.getAddress();
              wx.hideLoading();
            },
            error: function (err) {
              console.log(err);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  getAddress: function () {
    let me = this;
    wx.request({
      url: app.baseUrl + '/address',
      data: { userId: me.data.userId },
      method: 'GET',
      success: function (res) {
        let v = res.data.data.find((value) => value.defaults == 1); 
        me.setData({
          addressDate: res.data.data,
          chooseAddress: v!='undefined' ? v : res.data.data[0]
        })
        console.log(v);
      }
    });
  },
  onLoad: function (options) {
    let me = this;
    me.getUser();
    
  },
  payFunc:function(){
    wx.request({
      url:'http://192.168.1.5:8888/order',
      data: {
        userId:941,
        addressId:129
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      success(res) {
       console.log(res.data);
        wx.requestPayment(
          {
            timeStamp: res.data.data.payParam.timeStamp,
            nonceStr: res.data.data.payParam.nonceStr,
            package: res.data.data.payParam.package,
            signType: res.data.data.payParam.signType,
            paySign: res.data.data.payParam.paySign,
            success: function (res) {
              console.log(res.data);
            },
            fail: function (res) {
              console.log(res);
             },
            complete: function (res) { }
          })
      }
    })
  }
})

