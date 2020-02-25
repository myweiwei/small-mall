const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},//商品详情页的数据
    // Banner数据
    images: [],
    // 是否显示面板指示点
    indicatorDots: true,
    // 滑动方向是否为纵向
    vertical: false,
    // 自动切换
    autoplay: true,
    // 采用衔接滑动
    circular: true,
    // 自动切换时间间隔2s
    interval: 6000,
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
      url: app.baseUrl + '/product',
      method: "get",
      data: {
        id:47
      },
      success: function (data) {
        var data = data.data.data;
        var images = data.images.split(";");
        for(var i = 0; i < images.length; i++){
          images[i] = "http://" + images[i];
          console.log(images[i]);
        }

        me.setData({
          product:data,
          images:images
        })
      }
    })
  }
});