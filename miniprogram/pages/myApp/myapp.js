const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    avatarUrl: '../../images/qing.png',
    userInfo: {},
    logged: true,
    takeSession: true,
    requestResult: ''
  },
  onLoad: function() {
    var that = this;
    // 查看是否授权

    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.setData({
            logged : false
          })
        }
      }
    })
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res.result.openid)
        var this_openid = res.result.openid
        app.globalData.openid = res.result.openid
        const db = wx.cloud.database()
        const myTodo = db.collection('counters').add({
          data: {
            openid : 1
          }
        })
      },
        // console.log(myTodo)
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // console.log(e.detail.userInfo);
      //授权成功后，跳转进入小程序首页
      that.setData({
        logged: true
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },

})