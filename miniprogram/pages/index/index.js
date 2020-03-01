// pages/index/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status:0,
    movieList: [],

    list:[],
    currentIndex:0,
    activeList:'',
    scrollTop:0,//滚上去了多少？
    heightList:[],//右侧菜单高度
    baseUrl:"",
    clickItem:"",
    unit:0,
    num:1,
    show1:false,
    userId:'',
    chooseSize:false,
    chooseData:[],
    chooseImageUrl:'',
    chooseZs:"0",
    chooseXs:'0',
    chooseWeight:'0',
    activeChoose:'',
    chooseUnit:'',
    chooseName:'',
    showLoad:false
  },
  // 展示选规格弹框
  showshadow: function (e) {
    let me=this;
    me.getGuige(e.target.dataset.item.id);
    me.setData({
      chooseSize:true,
      num:1
    })
  },
  //选规格弹框内容
  getGuige:function(id){
    let me = this;
    me.setData({
      chooseImageUrl: '',
      chooseZs: '',
      chooseXs:'',
      chooseWeight: ''
    })
    wx.request({
      url: me.data.baseUrl + '/productItem/',
      method: "get",
      data: {
        productId:id
      },
      success: function (data) {
        me.setData({
          chooseData:data.data.data
        })
        if (me.data.chooseData.length){
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
          chooseSize:true
        })
      },
      error: function (err) {
      }
    })
  },
  //选规则弹框内容切换
  changeChoose:function(e){
    let me=this;
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
  // 隐藏选规格弹框
  hideModal: function (e) {
    let me = this;
    me.setData({
      chooseSize: false
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
              me.setData({
                userId: data.data.data
              })
            },
            error: function (err) {
            }
          })
        } else {
        }
      }
    });
  },
  iptChange:function(e){
    let me=this;
    if (e.detail.value){
      me.setData({
        num: e.detail.value
      })
    }
  },
  buyNow:function(){
    var me = this;
    var requestParam = {userId:me.data.userId,
                        productId: me.data.activeChoose,
                        isPreOrder:1,
                        number:me.data.num};
    //先请求一个预下单接口，如果都符合购买条件，在跳转到预下单页面中
    wx.request({
      url: app.baseUrl + '/order',
      data: requestParam,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if(res.data.status == -1){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        else{
          wx.navigateTo({
            url: '/pages/mine/order/preorder/preorder?buyMethod=' + 1 + "&productId=" + me.data.activeChoose + "&number=" + me.data.num  
          });
        }
      }
    });
     
  },
  // 加入购物车
  addCar:function(){
    let me=this;
    wx.request({
      url: me.data.baseUrl + '/shopcar/product', 
      method: 'post',
      dataType:"json",
      data: {
        userId:me.data.userId,
        productId: me.data.activeChoose,
        number:me.data.num
      },
      success(res) {
        wx.showToast({
          title: '加入成功',
          icon:'success'
        });
        me.setData({
          chooseSize:false
        })
      },
      error:function(err){
      }
    })
  },
  getList:function(){
    let me=this;
    me.setData({
      showLoad:true
    })
    wx.request({
      url: this.data.baseUrl+'/products', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        for (let i = 0; i < res.data.data.length; i++) {
          for (var j = 0; j < res.data.data[i].products.length;j++){
            res.data.data[i].products[j].zs = app.getPrice(res.data.data[i].products[j].price).zs;
            res.data.data[i].products[j].xs = app.getPrice(res.data.data[i].products[j].price).xs;
          }
        }
        me.setData({
          list: res.data.data,
          showLoad:false
        })
        me._calculateHeight();
      }
    })
  },
  //左侧导航栏点击
  listClick:function(e){
    let me=this;
    me.setData({
      activeList:e.target.dataset.id,
      currentIndex:e.target.dataset.index
    })
  }, 
  //计算高度，为滚动准备
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
  //右侧滚动
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
  //关闭授权弹框
  onClose: function () {
    this.setData({
      show1: false
    })
  },
  goProductDetail: function(e){
    var productid = e.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: '../../pages/index/product_detail/product_detail?productId=' + productid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    if(1)
    {
      // wx.hideTabBar(); 
      this.setData({status:0});
      me.getTableData();
    }
    else{
      this.setData({status:1});
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
    let me = this;
    me.setData({
      baseUrl: app.baseUrl,
    });
    me.getUser();
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
    let me = this;
    me.getMovieList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getTableData: function (address) {//定义函数名称
    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      //请求地址
      url: "https://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a",
      data: {
        count: 10,
        start: that.data.movieList.length
      },
      header: {//请求头
        //"Content-Type": "application/json"
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'get',
      dataType: 'json',
      success: function (res) {
        that.setData({movieList:res.data.subjects});
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  toComment: function (event) {
    if (event.target.dataset.movieid) {
      wx.navigateTo({
        url: `../../pages/comment/comment?movieid=${event.target.dataset.movieid}`
      })
    }
    else {
      wx.navigateTo({
        url: `../comment/comment?movieid=${event.currentTarget.dataset.movieid}`
      })
    }

  },
})