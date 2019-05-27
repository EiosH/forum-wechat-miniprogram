var postsData = require('../../data/posts-data.js')
Page({
  data: {
    logged: true
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生的
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权

    wx.getSetting({
      success: res => {
        console.log(res.authSetting['scope.userInfo'])

        if (res.authSetting['scope.userInfo']==undefined) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.setData({
            logged: false
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
            openid: 1
          }
        })
      },
      // console.log(myTodo)
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  bindGetUserInfo: function (e) {
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
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
    // this.data.postList = postsData.postList
    this.setData({
       postList:postsData.postList
      });
  },

  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    // console.log("on post id is" + postId);
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  },

  onSwiperTap: function (event) {
    // target 和currentTarget
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }
})