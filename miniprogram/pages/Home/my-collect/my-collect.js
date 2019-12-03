var getData = require("../../posts/post.js").getData
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

Page({
  data: {
    logged: true,
    nickName: null
  },
  onLoad: function () {
    // 查看是否授权
    var that = this;
    this_database = [];
    this.data.nickName = app.globalData.nickName
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    });
    db.collection('collect').where({
      show: "true"
    }).get({
      success(res) {
        for(let item in res.data){
          db.collection('data').where({
            _id: res.data[item].collect_id
          }).get({
            success(res) {
              if (res.data[0]) {
                this_database.push(res.data[0])
                getData.getData(this_database, that)
              }
              setTimeout(()=>{
                wx.hideLoading();
              },600)
            }
          })
        }
      }
    });
   
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '正在刷新',
      icon: 'loading',
      duration: 2000
    });
    this.onLoad()
  },
  delete_collect: function (event) {
    var postId = event.currentTarget.dataset;
    var id = postId.id;
    var that = this;
    db.collection('collect').where({
      collect_id: id
    }).get({
      success(res) {
        for (let item of res.data) {
          db.collection('collect').doc(item._id).remove()
        }
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 600
        })
        that.onLoad()
      }
    })
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
      url: "../../posts/post-detail/post-detail?id=" + postId
    })
  },
  collect_btn: function (event) {
    var that = this;
    var postId = event.currentTarget.dataset;
    var id = postId.id.split(".")[0]
    var idx = postId.id.split(".")[1]
    var src = postId.id.split(".")[2]
    db.collection('collect').add({
      data: {
        _id: id,
        show: "true",
      },
      success(res) {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 600
        })
      }
    })
    db.collection('collect').where({ //收藏
      _id: id
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
  },

})