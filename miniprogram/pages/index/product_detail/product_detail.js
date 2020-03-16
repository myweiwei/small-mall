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
    nextMargin: 0,
    chooseSize:false,
    productId:'',
    chooseData: [],
    chooseImageUrl: '',
    chooseZs: "0",
    chooseXs: '0',
    chooseWeight: '0',
    activeChoose: '',
    chooseUnit: '',
    chooseName: '',
    num:0,
    confirmFlag:0,
    userId:'',
    showLoad:false

  },
  // 展示选规格弹框
  showshadow: function (e) {
    let me = this;
    if (e.target.dataset.item=='addCar'){
      me.setData({
        confirmFlag:0
      })
    }
    else {
      me.setData({
        confirmFlag:1
      })
    }
    me.getGuige(me.data.productId, me.data.confirmFlag);
    me.setData({
      num: 1
    })
  },
  hideModal: function (e) {
    let me = this;
    me.setData({
      chooseSize: false
    })
  },
  confirmFunc:function(){
    let me=this;
    if(!me.data.confirmFlag){
      wx.request({
        url: app.baseUrl + '/shopcar/product',
        method: 'post',
        dataType: "json",
        data: {
          userId: me.data.userId,
          productId: me.data.activeChoose,
          number: me.data.num
        },
        success(res) {
          wx.showToast({
            title: '加入成功',
            icon: 'success'
          });
          me.setData({
            chooseSize: false
          })
        },
        error: function (err) {
        }
      })
    }
    else {
      var requestParam = {
        userId: me.data.userId,
        productId: me.data.activeChoose,
        isPreOrder: 1,
        number: me.data.num
      };
      //先请求一个预下单接口，如果都符合购买条件，在跳转到预下单页面中
      wx.request({
        url: app.baseUrl + '/order',
        data: requestParam,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          if (res.data.status == -1) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          else {
            wx.navigateTo({
              url: '/pages/mine/order/preorder/preorder?buyMethod=' + 1 + "&productId=" + me.data.activeChoose + "&number=" + me.data.num
            });
          }
        }
      });
    }
  },
  //选规则弹框内容切换
  changeChoose: function (e) {
    let me = this;
    me.setData({
      chooseImageUrl: e.target.dataset.item.picture,
      chooseZs: app.getPrice(e.target.dataset.item.price).zs,
      chooseXs: app.getPrice(e.target.dataset.item.price).xs,
      chooseWeight: e.target.dataset.item.weight,
      activeChoose: e.target.dataset.item.id,
      chooseUnit: e.target.dataset.item.unit,
      chooseName: e.target.dataset.item.name
    })
  },
  getGuige: function (id) {
    let me = this;
    me.setData({
      chooseImageUrl: '',
      chooseZs: '',
      chooseXs: '',
      chooseWeight: '',
      showLoad :true
    })
    wx.request({
      url: app.baseUrl + '/productItem/',
      method: "get",
      data: {
        productId: id
      },
      success: function (data) {
        me.setData({
          chooseData: data.data.data
        })
        if (me.data.chooseData.length) {
          me.setData({
            chooseImageUrl: me.data.chooseData[0].picture,
            chooseZs: app.getPrice(me.data.chooseData[0].price).zs,
            chooseXs: app.getPrice(me.data.chooseData[0].price).xs,
            chooseWeight: me.data.chooseData[0].weight,
            activeChoose: me.data.chooseData[0].id,
            chooseUnit: me.data.chooseData[0].unit,
            chooseName: me.data.chooseData[0].name
          })
        }
        me.setData({
          chooseSize: true,
          showLoad: false
        })
      },
      error: function (err) {
      }
    })
  },
  //选规格弹框数量操作
  jia: function (e) {
    var num = e.currentTarget.dataset.num;
    num++;
    this.setData({ num: num })
  },
　jian: function (e) {
    var num = e.currentTarget.dataset.num;
    if (num > 1) {
      num--;
    }
    this.setData({ num: num })
　},
  iptChange: function (e) {
    let me = this;
    if (e.detail.value) {
      me.setData({
        num: e.detail.value
      })
    }
  },
  goHome:function(){
    wx.navigateBack({
      url: '/pages/index/index'
    })
  },
  goCook:function(options){
    var catalogId = options.currentTarget.id;
    wx.navigateTo({
      url: '/pages/cook/cooklist/cooklist?productId=' + catalogId
    })
  },
  onLoad:function(options){
    var me = this;
    me.setData({
      productId: options.productId,
      showLoad:true
    });
    me.getUser();
  },
  getData:function(){
    let me=this;
    wx.request({
      url: app.baseUrl + '/product',
      method: "get",
      data: {
        id: me.data.productId
      },
      success: function (data) {
        me.setData({
          showLoad:false
        });

        var data = data.data.data;
        var images = data.images.split(";");
        for (var i = 0; i < images.length; i++) {
          images[i] = "http://" + images[i];
        }
        for (let j = 0; j < data.productItem.length;j++){
          data.productItem[j].zs = app.getPrice(data.productItem[j].price).zs;
          data.productItem[j].xs = app.getPrice(data.productItem[j].price).xs;
        }
        me.setData({
          product: data,
          images: images
        })
      }
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
              me.getData();
            },
            error: function (err) {
            }
          })
        } else {
        }
      }
    });
  }
});