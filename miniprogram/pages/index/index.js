// pages/index/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    currentIndex:0,
    activeList:'',
    scrollTop:0,//滚上去了多少？
    heightList:[],//右侧菜单高度
    baseUrl:"",
    show:false,
    clickItem:"",
    unit:0,
    num:1,
    totalPrice:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show1:false,
    userId:''
  },
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
　num: function (e) {
  　　var num = e.detail.value;
  　　this.setData({ num: num });
　},
  getUser: function () {
    var me = this;
    wx.login({
      success(res) {
        if (res.code) {
          //通过wx.login内置函数，得到临时code码
          wx.request({
            url: me.data.baseUrl + '/openIdSessionKey',
            method: "get",
            data: {
              code: res.code
            },
            success: function (data) {
              console.log(data);
              me.setData({
                userId: data.data.data
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
  },
  addCar:function(e){
    let me=this;
    let item = e.currentTarget.dataset.item;
    wx.request({
      url: this.data.baseUrl + '/shopcar/product', 
      method: 'post',
      dataType:"json",
      data: {
        userId:me.data.userId,
        productId:item.id,
        number:me.data.num,
        unit:me.data.unit
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: '加入成功',
          icon:'success'
        });
        me.setData({
          show:false
        })
      },
      error:function(err){
        console.log(err);
      }
    })
  },
  getList:function(){
    let me=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.baseUrl+'/products', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        me.setData({
          list: res.data.data
        })
        me._calculateHeight();
        wx.hideLoading();
      }
    })
  },
  onClose:function(){
    this.setData({
      show:false,
      show1:false
    })
  },
  listClick:function(e){
    let me=this;
    me.setData({
      activeList:e.target.dataset.id,
      currentIndex:e.target.dataset.index
    })
  }, 
  chooseJlFunc:function(e){
    this.setData({
      unit:e.target.dataset.val
    })
  },
  _calculateHeight() {
    let height = 0;
    var arr=[];
    arr.push(height);
    wx.createSelectorQuery().selectAll('.fishList').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        height += (rect.height-26);
        arr.push(height);
      })
    }).exec();
    this.setData({
      heightList: arr
    })
  },
  scrollFunc:function(e){
    this.setData({
      scrollTop: e.detail.scrollTop
    })
    for (let i = 0; i < this.data.heightList.length; i++) {
      let height1 = this.data.heightList[i];
      let height2 = this.data.heightList[i + 1];
      if (!height2 || (e.detail.scrollTop >= height1 && e.detail.scrollTop < height2)) {
        this.setData({
          currentIndex: i
        })
        return;
      }
    }
    this.setData({
      currentIndex: 0
    })
  },
  chooseFunc:function(e){
    let me=this;
    me.setData({
      show:true,
      clickItem: e.target.dataset.item
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
    me.setData({
      baseUrl: app.baseUrl,
    });
    me.getUser();
    me.getList();
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
    me.getList();
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