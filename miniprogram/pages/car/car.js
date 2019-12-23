// pages/car/car.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carData:[
    ],
    baseUrl: '',
    userId: '',
    name:"dx"
  },
  getUser: function () {
    var me = this;
    wx.login({
      success(res) {
        if (res.code) {
          //通过wx.login内置函数，得到临时code码
          wx.request({
            url: me.data.baseUrl + '/openIdSessionKey',
            method:"get",
            data: {
              code: res.code
            },
            success: function (data) {
              console.log(data);
              me.setData({
               userId:data.data.data
              },()=>{
                me.getCarData()
              })
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
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //         }
    //       })
    //     }
    //     else {
    //       that.setData({ show1: true })
    //     }
    //   }
    // })
  },
  checkboxChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  getCarData:function(){
      let me = this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: me.data.baseUrl + '/shopcar/products',
        method: 'get',
        data: {
          userId: me.data.userId,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          me.setData({
            carData: res.data.data
          })
          console.log(res.data.data);
          wx.hideLoading();
        },
        error: function (err) {
          console.log(err);
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this;
    me.setData({
      baseUrl: app.baseUrl
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let me = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let me=this;
    me.getUser();
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