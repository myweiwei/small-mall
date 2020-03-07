const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products:[],
    // Banner数据
    images: [
      "http://shop.lileiit.com/banner002.jpg",
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
    interval: 5000,
    // 滑动动画时长0.5s
    duration: 500,
    // 前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
    previousMargin: 0,
    // 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
    nextMargin: 0
  },
  goProductDetail: function(e){
    var productid = e.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: '../../pages/index/product_detail/product_detail?productId=' + productid
    })
  },
  onShow:function(){
    var me = this;
    wx.request({
      url: app.baseUrl + '/recommendProduct',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].zs = app.getPrice(res.data.data[i].price).zs;
            res.data.data[i].xs = app.getPrice(res.data.data[i].price).xs;
        }
        me.setData({
          products: res.data.data
        })
      }
    });
  }
});