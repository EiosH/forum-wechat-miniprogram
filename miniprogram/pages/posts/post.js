// 时间问题
//图片样式问题
//管理员
const app = getApp();
const db = wx.cloud.database()
var util = require('../../utils/utils.js');
var getTime = require('../../data/time.js');
var time = util.formatTime(new Date());
var nowTime = time.split("/")
var this_database = [];
var comment
var current_com;
const upData = function(this_database, that) {
  that.setData({
    postList: this_database,
  })
}
var getData = function(this_database, that) {
  const upData = function(this_database) {
    that.setData({
      postList: this_database,
    })
  }
  for (let i in this_database) {
    i = parseInt(i)
    this_database[i].my_idx = i
    this_database[i].my_date = getTime.getTime(nowTime, this_database[i].date)
    db.collection("comment").where({
      post: this_database[i]._id
    }).get({ //评论加载
      success(res) {
        let comment = res.data
        if (comment.length) {
          this_database[i].my_comment = []
          for (let item of comment) {
            this_database[i].my_comment.push(item.content)
          }
        }
        db.collection('collect').where({
          collect_id: this_database[i]._id
        }).get({
          success(res) {
            if (!res.data[0] || res.data[0].show == "false") {
              this_database[i].collect_src = false
            } else if (res.data[0].show == "true") {
              this_database[i].collect_src = true
            }
            if (i === this_database.length - 1) {
              upData(this_database)
            }
          }
        })
      }
    })
  }
}
exports.getData = {
  getData
}


Page({

  data: {
    logged: true,
    disabled: false
  },
  onLoad: function() {
    // 查看是否授权

    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.setData({
            logged: false
          })
        }
      }
    })
    wx.getUserInfo({
      success: res => {
        app.globalData.nickName = res.userInfo.nickName
      }
    })

    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    });

    const that = this;
    db.collection('data').orderBy('time', 'desc').get({
      success(res) {
        this_database = res.data;
        getData(this_database, that)
        wx.hideLoading();

      }
    })


  },

  onPullDownRefresh: function() {
    wx.showToast({
      title: '正在刷新',
      icon: 'loading',
      duration: 2000
    });
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
    var postId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  },
  collect_btn: function(event) {
    var that = this;
    var postId = event.currentTarget.dataset;
    var id = postId.id.split(".")[0]
    var idx = postId.id.split(".")[1]
    var src = postId.id.split(".")[2]
    db.collection('collect').orderBy('time', 'desc').get({
      success(res) {
        var suc = 0;
        for (let i of res.data) {
          if (i.collect_id == id){
            suc = 1;
            break;
          }
        }
        if (suc ==1) {
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
  comment_btn: function(event) { //评论
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
  no_focus: function() {
    this.setData({
      disabled: false
    })
  },
  confirm_btn: function(event) { //评论
    var that = this
    var value = []
    value[0] = event.detail.value
    value[1] = app.globalData.nickName
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
            getData(this_database, that)
            current_com = null
          }
        })
      )
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
    // this.data.postList = postsData.postList

  },


  post_btn: function(event) {
    var Id = event.target.dataset.id;
    if (Id == "失物招领") {
      wx.navigateTo({
        url: '/pages/posts/post-url/S/S',
      })
    } else if (Id == "兼职信息") {
      wx.navigateTo({
        url: '/pages/posts/post-url/J/J',
      })
    } else if (Id == "二手交易") {
      wx.navigateTo({
        url: '/pages/posts/post-url/E/E',
      })
    } else if (Id == "表白吐槽") {
      wx.navigateTo({
        url: '/pages/posts/post-url/B/B',
      })
    }
  },

  ESJY_btn: function() {
    wx.navigateTo({
      url: '/pages/posts/post-url/E/E',
    })
  },
  SWZL_btn: function() {
    wx.navigateTo({
      url: '/pages/posts/post-url/S/S',
    })
  },
  JZXX_btn: function() {
    wx.navigateTo({
      url: '/pages/posts/post-url/J/J',
    })
  },
  XSTC_btn: function() {
    wx.navigateTo({
      url: '/pages/posts/post-url/B/B',
    })
  },

})