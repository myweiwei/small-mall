const app = getApp();
var orderNo;
Page({
  data: {
    active: 0,
    obj: {},
    time: 0, //倒计时剩余时间
    timeData: {}//onChange方法取time的时间，给timeData用
  },

  onChange(e) {
    var that = this;
    if (e.detail.hours == 0 && e.detail.minutes == 0 && e.detail.seconds == 0) {
      //重新加载该订单状态
      wx.request({
        url: app.baseUrl + '/order',
        data: {
          orderNo: orderNo
        },
        method: 'GET',
        success(res) {
          console.log("订单支付时间超时，重新请求数据刷新页面" + res.data.data);
          getData(res, that);
        }
      })

    }
    this.setData({
      timeData: e.detail
    });
    console.log(e.detail);
  },

  onLoad: function (options) {
    var that = this;
    orderNo = options.orderNo;
    wx.request({
      url: app.baseUrl + '/order',
      data: {
        orderNo: orderNo
      },
      method: 'GET',
      success(res) {
        getData(res, that);
        console.log(res.data.data + "----------------------");
      }
    })
  },
  cancelOrder: function () {
    var that = this;
    wx.request({
      url: app.baseUrl + '/cancelOrder',
      data: {
        userId: 288,
        orderNo: orderNo
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      success(res) {
        wx.request({
          url: app.baseUrl + '/order',
          data: {
            orderNo: orderNo
          },
          method: 'GET',
          success(res) {
            getData(res, that);
          }
        })
      }
    })
  }
})

function getData(res, that) {
  var order = res.data.data;
  that.setData({ time: order.waitPayTime });

  var a = (order.price / 100).toFixed(2).split('.');
  order.zs = a[0];
  order.xs = a[1];


  var orderDetail = res.data.data.orderItem;
  for (let i = 0; i < orderDetail.length; i++) {
    var totalPrice = orderDetail[i].totalPrice;
    var b = (totalPrice / 100).toFixed(2).split('.');
    orderDetail[i].zs = b[0];
    orderDetail[i].xs = b[1];
  }

  that.setData({ obj: res.data.data });
  console.log(res.data.data);
}