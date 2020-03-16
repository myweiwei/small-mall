// pages/mine/order/preorder/paySuccess/paySuccess.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice:0,
    zs:0,
    xs:0
  },
  toOrder:function(){
    wx.redirectTo({
      url: '/pages/mine/order/order',
    })
  },
  tell:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['Qald-X-SYPJ6yCpixJKtsrnyBtSjC9yjb0QzCBLG8PI'],
      success(res) {
        wx.redirectTo({
          url: '/pages/mine/order/order',
        })
       }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
    me.setData({
      zs: app.getPrice(options.totalPrice).zs,
      xs: app.getPrice(options.totalPrice).xs
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})