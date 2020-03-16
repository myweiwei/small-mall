const app = getApp();
const tapItemArray = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
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
    let me = this;
    this.getUser();
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

  },
  goCook:function(){
    wx.navigateTo({
      url:'/pages/cook/cook'
    })
  },
  goPhone:function(){
      wx.makePhoneCall({
        phoneNumber: '16619962166',
      })
  },
  aboutus:function(){
    wx.navigateTo({
      url: '/pages/mine/aboutus/aboutus',
    })
  },
  getUser: function () {
    var me = this;
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

              //
              wx.request({
                url: app.baseUrl + '/statisticQuantity',
                data: { userId:me.data.userId },
                method: 'GET',
                success: function (res) {
                  if(res.data.data != "" && res.data.data != null){
                    me.setData({
                      unPay: res.data.data.unPay,
                      pay: res.data.data.pay,
                      receive: res.data.data.receive
                    });
                  }
                 
                }
              });


            },
            error: function (err) {
            }
          })
        } else {
        }
      }
    });
  },
  onShow: function () {
    let me = this;
    me.getUser();
  },
})