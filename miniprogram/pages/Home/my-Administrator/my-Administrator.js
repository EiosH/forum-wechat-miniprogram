var getData = require("../../posts/post.js").getData
const app = getApp();
const db = wx.cloud.database()
var this_database = [];
var comment
var current_com;
var password;
const upData = function(this_database, that) {
  that.setData({
    postList: this_database,
  })
}
Page({
  data: {
    logged: true,
    login: false,
    nickName: null
  },
  onLoad: function() {
    // 查看是否授权
    var that = this;
    this.data.nickName = app.globalData.nickName
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    });
    db.collection('data').orderBy('time', 'desc').get({
      success(res) {
        // res.data 是包含以上定义的两条记录的数组
        this_database = res.data;
        getData.getData(this_database, that)
        wx.hideLoading();
      }
    })
  },
  onPullDownRefresh: function() {
    this.onLoad()
  },
  previewImage: function(e) {
    var current = e.target.dataset.id.split(",")
    var urls = [];
    var current_len = current.length
    for (var i = 1; i <= current_len; i++) {
      if (current[i] != current[0]) {
        urls.push(current[i])
      }
    }
    urls.unshift(current[0])
    wx.previewImage({
      current: current[0],
      urls: urls // 需要预览的图片http链接列表
    })
  },
  onPostTap: function(event) {
    wx.showToast({
      title: '管理员模式下无法操作',
      icon: 'none',
      duration: 600
    })
  },
  delete: function(event) {
    var postId = event.currentTarget.dataset;
    var id = postId.id;
    var that = this;
    wx.cloud.callFunction({
        // 云函数名称
        name: 'remove',
        // 传给云函数的参数
        data: {
          id: id
        },
      })
      .then(res => {
        try {
          that.onLoad()
        } catch (err) {
          console.log(err)
        }
      })
  },
  collect_btn: function(event) {
    wx.showToast({
      title: '管理员模式下无法操作',
      icon: 'none',
      duration: 600
    })
  },
  bindInput: function(e) {
    password = null;
    password = e.detail.value
  },
  password: function() {
    var that = this;
    if (password.toLowerCase() === 'root') {
      this.setData({
        login: true
      })
      wx.showToast({
        title: '登录成功'
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '密码错误'
      })
    }
    password = null;
  },
  // 失去焦点
  comment_btn: function(event) { //评论
    wx.showToast({
      title: '管理员模式下无法操作',
      icon: 'none',
      duration: 600
    })
  }

})