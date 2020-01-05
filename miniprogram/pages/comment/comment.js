// pages/comment/comment.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieid:'',
    dataList:{},
    value: '',
    score:5,
    images:[],
    fileIDList:[],
  },
  onChange(event) {
    // event.detail 为当前输入的值
  },
  onScoreChange:function(event) {
  },
  getCommentList: function () {
    let me = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        movieid: me.data.movieid
      }
    }).then(res => {
      this.setData({
        dataList:JSON.parse(res.result)
      })
      wx.hideLoading();
    })
  },
  upload:function(){
    let me=this;
    wx.chooseImage({
      count: 2,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        me.setData({
          images: me.data.images.concat(tempFilePaths)
        })
      }
    })
  },
  submit:function(){
    let me=this;
    wx.showLoading({
      title: '评论中'
    })
    let promiseArr=[];
    for(var i=0;i<me.data.images.length;i++){
      promiseArr.push(new Promise((resolve,rreject)=>{
        let item  = this.data.images[i];
        let suffix= /\.\w+$/.exec(item);
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            me.setData({
              fileIDList:this.data.fileIDList.concat(res.fileID)
            })
            resolve();
          },
          fail: console.error
        })
      }))
    };
    Promise.all(promiseArr).then(function(){
      db.collection('comment').add({
        data:{
          value:me.data.value,
          score:me.data.score,
          fileIDList:me.data.fileIDList,
          movieid:me.data.movieid
        }
      })
    }).then(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '评价成功'
      })
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title: '评价失败'
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
    me.setData({
      movieid: options.movieid
    });
    me.getCommentList();
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