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
    show:false,
    popData:'',
    number:1,
    id:'',
    show1:false,
    editFlag:false,
    allChecked:false,
    checkArr:[],
  },
  toIndex:function(){
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  editFunc:function(e){
    let me=this;
    me.setData({
      editFlag:true
    })
  },
  onChange:function(e){
    let me=this;
    me.setData({
      number:e.detail
    })
  },
  showPopup:function(e){
    let me=this;
    me.setData({
      show:true,
      number: e.target.dataset.item.number,
      id: e.target.dataset.item.productId
    })
  },
  onClose: function () {
    let me = this;
    me.setData({
      show: false
    })
  },
  addCar:function(e){
    let me=this;
    me.setData({
      show1:true
    })
    wx.request({
      url: me.data.baseUrl + '/shopcar/updateProduct/',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        userId:me.data.userId,
        productId: e.target.dataset.id,
        number:me.data.number
      },
      success: function (data) {
        me.setData({
          show1: false,
          show:false
        })
        me.getCarData();
      },
      error: function (err) {
        console.log(err);
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
            url: me.data.baseUrl + '/openIdSessionKey',
            method:"get",
            data: {
              code: res.code
            },
            success: function (data) {
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
  },
  checkboxChange:function(e){
    let me=this;
    me.setData({
      show1: true
    })
    if (e.detail.value[0]){
      wx.request({
        url: me.data.baseUrl + '/shopcar/checkOne',
        method: "POST",
        data: {
          userId: me.data.userId,
          productId: parseInt(e.detail.value[0]),
        },
        success: function (data) {
          me.getCarData();
          me.setData({
            show1: false
          })
        },
        error: function (err) {
          console.log(err);
        }
      })
    }
    else {
      wx.request({
        url: me.data.baseUrl + '/shopcar/unCheckOne',
        method: "POST",
        data: {
          userId: me.data.userId,
          productId: parseInt(e.target.dataset.id),
        },
        success: function (data) {
          me.getCarData();
          me.setData({
            show1: false
          })
        },
        error: function (err) {
          console.log(err);
        }
      })
    }
  },
  checkboxChange1:function(e){
    let me=this;
    let arr = me.data.carData;
    if(e.detail.value.length){
      for (var i = 0; i < arr.cartProductVOList.length;i++){
        if (arr.cartProductVOList[i].productId == e.detail.value[0]) {
          arr.cartProductVOList[i].checkFlag=true;
        }
      }
    }
    else {
      let id = e.target.dataset.id;
      for (var i = 0; i < arr.cartProductVOList.length; i++)       {
        if (arr.cartProductVOList[i].productId == id) {
          arr.cartProductVOList[i].checkFlag = false;
        }
      }
      me.setData({
        allChecked:false
      })
    }
    me.setData({
      carData:arr
    })
    let arr1=[];
    for (let i = 0; i < me.data.carData.cartProductVOList.length;i++){
      if (me.data.carData.cartProductVOList[i].checkFlag){
        arr1.push(me.data.carData.cartProductVOList[i].productId);
      }
    }
    me.setData({
      checkArr:arr1
    })
    if(me.data.checkArr.length==me.data.carData.cartProductVOList.length){
      me.setData({
        allChecked:true
      })
    }
  },
  allcheckboxChange:function(e){
    let me = this;
    me.setData({
      show1: true
    })
    if (e.detail.value.length) {
      wx.request({
        url: me.data.baseUrl + '/shopcar/checkAll',
        method: "POST",
        data: {
          userId: me.data.userId
        },
        success: function (data) {
          me.getCarData();
          me.setData({
            show1: false
          })
        },
        error: function (err) {
          console.log(err);
        }
      })
    }
    else {
      wx.request({
        url: me.data.baseUrl + '/shopcar/unCheckAll',
        method: "POST",
        data: {
          userId: me.data.userId
        },
        success: function (data) {
          me.getCarData();
          me.setData({
            show1: false
          })
        },
        error: function (err) {
          console.log(err);
        }
      })
    }
  },
  allcheckboxChange1:function(e){
    let me=this;
    let arr1 = [];
    if(e.detail.value.length){
      let list=me.data.carData;
      for (var i = 0; i < list.cartProductVOList.length;i++)      {
        list.cartProductVOList[i].checkFlag=true;
        arr1.push(list.cartProductVOList[i].productId);
        list.cartProductVOList[i].zs = app.getPrice(list.cartProductVOList[i].price).zs;
        list.cartProductVOList[i].xs = app.getPrice(list.cartProductVOList[i].price).xs;
      }
      me.setData({
        carData:list,
        checkArr: arr1,
      })
    }
    else {
      let list = me.data.carData;
      for (var i = 0; i < list.cartProductVOList.length; i++)     {
        list.cartProductVOList[i].checkFlag = false;
        list.cartProductVOList[i].zs = app.getPrice(list.cartProductVOList[i].price).zs;
        list.cartProductVOList[i].xs = app.getPrice(list.cartProductVOList[i].price).xs;
      }
      me.setData({
        carData: list,
        checkArr:[]
      })
    }
  },
  delFunc:function(){
    let me=this;
    me.setData({
      show1: true
    })
    wx.request({
      url: me.data.baseUrl + '/shopcar/product/ ',
      method: "DELETE",
      data: {
        userId: me.data.userId,
        productIds:me.data.checkArr,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (data) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
        me.getCarData();
        me.setData({
          show1: false,
          editFlag:false
        })
      },
      error: function (err) {
        console.log(err);
      }
    })
  },
  saveFunc:function(){
    let me=this;
    me.setData({
      editFlag:false
    })
  },
  getCarData:function(){
      let me = this;
      me.setData({
        show1: true
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
          console.log(res.data);
          for (var i = 0; i < res.data.data.cartProductVOList.length;i++){
            res.data.data.cartProductVOList[i].checkFlag=false;
            res.data.data.cartProductVOList[i].zs = app.getPrice(res.data.data.cartProductVOList[i].price).zs;
            res.data.data.cartProductVOList[i].xs = app.getPrice(res.data.data.cartProductVOList[i].price).xs;
            
          }
          res.data.data.cartTotalPriceZs = app.getPrice(res.data.data.cartTotalPrice).zs;
          res.data.data.cartTotalPriceXs = app.getPrice(res.data.data.cartTotalPrice).xs;
          me.setData({
            carData: res.data.data,
            show1:false
          })
          wx.hideLoading();
        },
        error: function (err) {
          console.log(err);
        }
      })
  },
  jia:function(e){
    let me = this;
    me.setData({
      show1: true
    })
    let number = e.target.dataset.item.number;
    if (e.target.dataset.operate==1){
      number++;
    }
    else if(number>1){
      number--;
    }
    if(number>=1){
      wx.request({
        url: me.data.baseUrl + '/shopcar/updateProduct/',
        method: "POST",
        data: {
          userId: me.data.userId,
          productId: e.target.dataset.item.productId,
          number: number
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (data) {
          me.getCarData();
          me.setData({
            show1: false
          })
        },
        error: function (err) {
          console.log(err);
        }
      })
    }
  },
  preOrder: function(e){
    if(e.currentTarget.dataset.total>=app.lowerBuyLimit){
      wx.navigateTo({
        url: '/pages/mine/order/preorder/preorder'
      });
    }
    else {
      wx.showToast({
        title: '再买点别的吧，30元起送哦！',
        icon: 'none',
        duration: 2000
      })
    }
    
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