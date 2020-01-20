const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products:[],
    // Banner数据
    images: [
      "http://shop.lileiit.com/banner5.png",
      "http://shop.lileiit.com/banner3.png",
      "http://img.zcool.cn/community/01e03b58047e96a84a0e282b09e8fc.jpg",
      "http://pic.90sjimg.com/back_pic/00/00/69/40/d678a42886e0232aaea0d6e69e9b1945.jpg",
      "http://img.zcool.cn/community/0132dd55800bc700000059ffbe83e9.jpg@1280w_1l_2o_100sh.jpg",
      "http://img.zcool.cn/community/0154755a2df102a80120ba3828b5af.jpg@1280w_1l_2o_100sh.jpg",
      "http://pic.90sjimg.com/back_pic/00/00/69/40/bf4f8e2ab7e05dc3c7cc2a7f7e9c2fe7.jpg",
      "http://img.zcool.cn/community/01a2a2594943d3a8012193a328e0fd.jpg@1280w_1l_2o_100sh.jpg"
    ],
    // 是否显示面板指示点
    indicatorDots: true,
    // 滑动方向是否为纵向
    vertical: false,
    // 自动切换
    autoplay: true,
    // 采用衔接滑动
    circular: true,
    // 自动切换时间间隔2s
    interval: 2000,
    // 滑动动画时长0.5s
    duration: 500,
    // 前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
    previousMargin: 0,
    // 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
    nextMargin: 0
  },
  onShow:function(){
    var me = this;
    wx.request({
      url: app.baseUrl + '/recommendProduct',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (data) {
        me.setData({
          products: data.data.data
        })
      }
    });
  }
});