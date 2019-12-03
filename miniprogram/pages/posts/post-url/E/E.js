var getData = require("../../post.js").getData
const app = getApp();
const db = wx.cloud.database()
var this_database = [];
var comment
var current_com;

const upData = function (this_database, that) {
  that.setData({
    postList: this_database,
  })
}
// var that = this;
Page({

  data: {
    logged: true,
    nickName: null
  },
  onLoad: function () {
    // 查看是否授权
    var that = this;
    this.data.nickName = app.globalData.nickName
    db.collection('data').limit(6).orderBy('time', 'desc').where({
      type: "二手交易"
    }).get({
      success(res) {
        // res.data 是包含以上定义的两条记录的数组
        this_database = res.data;
        getData.getData(this_database, that)
      }
    })
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '正在刷新',
      icon: 'loading',
      duration: 2000
    });
    this.onLoad()
  },

  previewImage: function (e) {
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
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../../post-detail/post-detail?id=" + postId
    })
  },
  collect_btn: function (event) {
    var that = this;
    var postId = event.currentTarget.dataset;
    var id = postId.id.split(".")[0]
    var idx = postId.id.split(".")[1]
    var src = postId.id.split(".")[2]
    db.collection('collect').orderBy('time', 'desc').get({
      success(res) {
        var suc = 0;
        for (let i of res.data) {
          if (i.collect_id == id) {
            suc = 1;
            break;
          }
        }
        if (suc == 1) {
          db.collection('collect').where({ //收藏
            collect_id: id,
            collecter: app.globalData.nickName
          }).get({
            success(res) {
              var Id = res.data[0]._id
              if (res.data[0].show == "true") {
                db.collection('collect').doc(Id).update({
                  data: {
                    show: "false"
                  }
                })
                this_database[idx].collect_src = false
              } else if (res.data[0].show == "false") {
                db.collection('collect').doc(Id).update({
                  data: {
                    show: "true"
                  },
                  success(res) {
                    wx.showToast({
                      title: '收藏成功',
                      icon: 'success',
                      duration: 600
                    })
                  }
                })
                this_database[idx].collect_src = true
              }
              upData(this_database, that)
            }
          })
        } else {
          db.collection('collect').add({
            data: {
              collect_id: id,
              show: "true",
              collecter: app.globalData.nickName
            },
            success(res) {
              wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 600
              })
              this_database[idx].collect_src = true
              upData(this_database, that)
            }
          })
        }
      }
    })





  },
  comment_btn: function (event) { //评论
    var that = this;
    var postId = event.currentTarget.dataset.id;
    var reply = postId.split(".")[0]
    var id = postId.split(".")[1]
    postId = null
    current_com = id
    // var  = postId.split(".")[0]
    that.setData({
      reply: reply,
      disabled: true
    })
  },
  // 失去焦点
  no_focus: function () {
    this.setData({
      disabled: false
    })
  },
  confirm_btn: function (event) { //评论
    var that = this
    var value = []
    value[0] = event.detail.value
    value[1] = this.data.nickName
    value[0] == "" || undefined || null || 0 || !value[1] ?
      wx.showToast({
        title: '内容为空',
        icon: "none"
      }) : (
        db.collection("comment").add({
          data: {
            content: value,
            post: current_com,
            poster: value[1]
          },
          success(res) {
            wx.showToast({
              title: '发布成功'
            })
            that.setData({
              disabled: false
            })
            getData.getData(this_database, that)
            current_com = null
          }
        })
      )
  }
  

})