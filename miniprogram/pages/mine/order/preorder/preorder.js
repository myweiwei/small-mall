const app = getApp();
var orderNo;
Page({
  data: {
    addressDate:[],
    chooseAddress:{},
    order:{},
    chooseId:'',
    showLoad:false
  },
  toAddress:function(e){
    wx.navigateTo({
      url: '/pages/mine/address/address?id=' + e.target.dataset.id
    });
  },
  getUser: function () {
    let me = this;
    me.setData({
      showLoad:true
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
                userId: data.data.data,
                showLoad: false
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
  onUnload: function () {
    // wx.reLaunch({
    //   url: '/pages/car/car'
    // })
  },
  getAddress: function () {
    let me = this;
    wx.request({
      url: app.baseUrl + '/address',
      data: { userId: me.data.userId },
      method: 'GET',
      success: function (res) {
        let v='';
        if (!me.data.chooseId||me.data.chooseId==undefined){
          v = res.data.data.find((value) => value.defaults == 1);
        } 
        else {
          v = res.data.data.find((value) => value.id == me.data.chooseId);
        }
        me.setData({
          addressDate: res.data.data,
          chooseAddress: v!=undefined ? v : res.data.data[0]
        })
        me.getData();
      }
    });
  },
  getData:function(){
    let me = this;
    wx.request({
      url: app.baseUrl + '/order',
      data: { userId: me.data.userId, province: me.data.chooseAddress.province, isPreOrder: 1, addressId: me.data.chooseAddress.id},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        me.setData({
          order:res.data.data
        })
      }
    });
  },
  onLoad: function (options) {
    let me = this;
    me.setData({
      chooseId: options.chooseId
    })
    me.getUser();
  },
  payFunc:function(){
    wx.request({
      url:'http://192.168.1.10:8888/order',
      data: {
        userId:288,
        addressId:129,
        isPreOrder:0,
        province:'hahah '
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      success(res) {
        wx.requestPayment(
          {
            timeStamp: res.data.data.payParam.timeStamp,
            nonceStr: res.data.data.payParam.nonceStr,
            package: res.data.data.payParam.package,
            signType: res.data.data.payParam.signType,
            paySign: res.data.data.payParam.paySign,
            success: function (res) {
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

