// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      name:'冻鱼',
      id:'a1'
    },{
      name:"海鲜", 
      id:'a2'
    },{
      name:"其他",
      id:'a3'
    }],
    content:[
      {id:"a1",name:'冻鱼类',price:'￥1.3/斤'},
      { id: "a2",name: '海鲜类', price: '￥2.3/斤' },
      { id: "a3", name: '其他类', price: '￥3.3/斤' }
    ],
    currentIndex:0,
    activeList:'a1',
    scrollTop:'',//滚上去了多少？
    heightList:[0,150,300]//右侧菜单高度
  },
  listClick:function(e){
    let me=this;
    me.setData({
      activeList:e.target.dataset.id,
      currentIndex:e.target.dataset.index
    })
  }, 
  scrollFunc:function(e){
    this.setData({
      scrollTop:e.detail.scrollTop
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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