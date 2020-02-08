const app = getApp();
const tapItemArray = [];
Page({
  data: {
    mydata:[],
    userId:'',
    show:true,
    chooseId:'',
    showLoad:false,
    buyMethod:0,
    productId:'',
    number:0
  },
  addAddressListener: function () {
    wx.navigateTo({
      url: '/pages/mine/address/addAddress/addAddress'
    })
  },
  toEdit: function (e) {
    let me=this;
    wx.navigateTo({
      url: '/pages/mine/address/editAddress/editAddress?item=' + JSON.stringify(e.target.dataset.item) + '&chooseId=' + me.data.chooseId + '& buyMethod=' + me.data.buyMethod + '& number=' + me.data.number + '& productId=' + me.data.productId
    })
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
              me.getData();
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
    me.setData({
      chooseId: options.id,
      buyMethod: options.buyMethod,
      productId: options.productId,
      number: options.number
    })
  },
  getData:function(){
    let me=this;
    me.setData({
      show: true
    })
    wx.request({
      url: app.baseUrl + '/address',
      data: { userId:me.data.userId },
      method: 'GET',
      success: function (res) {
        me.setData({
          mydata: res.data.data,
          show:false
        });
      }
    });
  },
  toOrder:function(e){
    let me=this;
    if (me.data.chooseId != undefined){
      wx.navigateTo({
        url: '/pages/mine/order/preorder/preorder?chooseId=' + e.currentTarget.dataset.id
      })
    }
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
    let me=this;
    if(me.data.chooseId==undefined){
      wx.reLaunch({
        url: '/pages/mine/mine'
      })
    }
    else {
      wx.reLaunch({
        url: '/pages/mine/order/preorder/preorder'
      })
    }
    
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