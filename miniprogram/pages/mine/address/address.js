const app = getApp();
const tapItemArray = [];
Page({
  addAddressListener: function () {
    wx.navigateTo({
      url: '/pages/mine/address/addAddress/addAddress'
    })
  },

  data: {
    mydata:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      var that = this;
      wx.request({
        url: app.baseUrl + '/address',
        data: { userId: 288},
        method: 'GET',
        success: function (res) {
          console.log(res.data.data);
          that.setData({
            mydata: res.data.data
          });
        }
       });
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