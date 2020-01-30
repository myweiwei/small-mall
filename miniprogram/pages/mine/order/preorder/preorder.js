const app = getApp();
var orderNo;
Page({
  data: {
    addressDate:[],
    chooseAddress:{},
    order:{},
    chooseId:'',//地址选中的ID
    showLoad:false,

    buyMethod:0,//购买方式，0是加入购物车，1是直接购买，直接购买情况需要productId和number
    productId:0,
    number:0
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
    var requestParam;
    if (me.data.buyMethod != "" && me.data.buyMethod == 1) {
      requestParam = { userId: me.data.userId, isPreOrder: 1, productId: me.data.productId, number: me.data.number }
    }
    else {
      requestParam = { userId: me.data.userId, isPreOrder: 1, }
    }
    if (me.data.chooseAddress && me.data.chooseAddress != undefined){
      requestParam = Object.assign(requestParam, { addressId: me.data.chooseAddress.id, province: me.data.chooseAddress.province})
    }
    else {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none',
        duration: 2000
      })
    }
    wx.request({
      url: app.baseUrl + '/order',
      data: requestParam,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res.data.data);
        for (let i = 0; i < res.data.data.orderItem.length;i++){
          res.data.data.orderItem[i].zs = app.getPrice(res.data.data.orderItem[i].currentUnitPrice).zs;
          res.data.data.orderItem[i].xs = app.getPrice(res.data.data.orderItem[i].currentUnitPrice).xs;
        }
        res.data.data.zs = app.getPrice(res.data.data.price).zs;
        res.data.data.xs = app.getPrice(res.data.data.price).xs;
        res.data.data.zs1 = app.getPrice(res.data.data.expressPrice).zs;
        res.data.data.xs1 = app.getPrice(res.data.data.expressPrice).xs;
        res.data.data.zs2 = app.getPrice(res.data.data.totalPrice).zs;
        res.data.data.xs2 = app.getPrice(res.data.data.totalPrice).xs;
        me.setData({
          order:res.data.data
        })
      }
    });
  },
  onLoad: function (options) {
    let me = this;
   
    me.setData({
      chooseId: options.chooseId,
    })
    console.log("buyMethod:........." + options.buyMethod);
    console.log("number:........." + options.number);
    console.log("productId:........." + options.productId);
    if(options.buyMethod != "" && options.productId != "" && options.number != ""){
      me.setData({
        buyMethod: options.buyMethod,
        productId: options.productId,
        number:options.number
      })
    }
    me.getUser();
  },
  payFunc:function(){
    let me=this;
    var requestParam;
    //直接购买
    if (me.data.buyMethod != "" && me.data.buyMethod == 1) {
      requestParam = {
        userId: me.data.userId, 
        province: me.data.chooseAddress.province, 
        isPreOrder: 0, 
        addressId: me.data.chooseAddress.id,
        productId: me.data.productId, 
        number: me.data.number
      }
    }
    //购物车模式
    else {
      requestParam = requestParam = {
        userId: me.data.userId, 
        province: me.data.chooseAddress.province, 
        isPreOrder: 0, 
        addressId: me.data.chooseAddress.id,
      }
    }
    if (me.data.chooseAddress && me.data.chooseAddress != undefined){
      requestParam = Object.assign(requestParam, { addressId: me.data.chooseAddress.id, province: me.data.chooseAddress.province})
    }

    wx.request({
      url:app.baseUrl+'/order',
      data: requestParam,
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
              wx.redirectTo({
                url: '/pages/mine/order/preorder/paySuccess/paySuccess'
              })
            },
            fail: function (res) {
              console.log(res);
              wx.navigateTo({
                url: '/pages/mine/order/order'
              });
             },
            complete: function (res) { }
          })
      }
    })
  }
})

