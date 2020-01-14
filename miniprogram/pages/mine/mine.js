const app = getApp();
const tapItemArray = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    unPay:"",
    pay:"",
    receive:""
  },
  orderClick:function(e){
    var enterMethod = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/mine/order/order?id=' + enterMethod
    });
  },
  
  addressListener: function () {
    wx.navigateTo({
      url: '/pages/mine/address/address'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
    var me = this;
    wx.request({
      url: app.baseUrl + '/statisticQuantity',
      data: { userId:288 },
      method: 'GET',
      success: function (res) {
        console.log(res.data.data);
        me.setData({
          unPay: res.data.data.unPay,
          pay: res.data.data.pay,
          receive: res.data.data.receive
        });
      }
    });
    
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