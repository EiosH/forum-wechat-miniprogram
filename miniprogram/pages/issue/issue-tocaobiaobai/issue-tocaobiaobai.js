const app = getApp()
const db = wx.cloud.database()
var util = require('../../../utils/utils.js')
var reg = /[0-9]/g;
var time;
var time2;
var nickName;
var avatarUrl;
var imageUrl = [];
var comment;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.getUserInfo({
      success: function(res) {
        avatarUrl = res.userInfo.avatarUrl,
          nickName = res.userInfo.nickName
      }
    })

  },
  searchBox: function(e) {
    comment == "" || undefined || null || 0 ?
      wx.showToast({
        title: '内容为空',
        icon: "none"
      }) : (
        comment.length <= 5 ?
        wx.showToast({
            title: '多写点东西在发表吧！',
          icon: "none"
        }) :
        wx.showToast({
          icon: "loading",
          duration: 20000
        }) & this.post_one(comment)
      )
  },
  bindTextAreaBlur: function(e) {
    comment = e.detail.value
  },

  post_one: function(content) {
    var moment = 0
    time = util.formatTime(new Date(), 1)
    time2 = util.formatTime(new Date(), 2)
    var that = this
    if (imageUrl.length > 0) {
      for (var i = 0; i < imageUrl.length; i++) {
        (function(i) {
          wx.cloud.uploadFile({
            cloudPath: imageUrl[i].slice(11),
            filePath: imageUrl[i],
            success: res => {
              imageUrl[i] = "cloud://my-yunkaifa-h449y.6d79-my-yunkaifa-h449y/" + imageUrl[i].slice(11)
              moment++;
              if (moment == imageUrl.length) {
                console.log(imageUrl)
                that.readyTopost(content)
              }
            },
            fail: res => {
              wx.showToast({
                title: '图片上传失败',
                icon: "none"
              })
            }
          })
        })(i)
      }
    } else {
      that.readyTopost(content)
    }


  },
  onImg: function() {
    var that = this;
    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths
        const images = that.data.images.concat(res.tempFilePaths)
        imageUrl = that.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        that.setData({
          images: images
        })
      }
    })
  },

  removeImage(e) {
    var that = this;
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    imageUrl = that.data.images
    that.setData({
      images: that.data.images
    })

  },
  readyTopost: function (content) {

    db.collection('data').add({
      data: {
        date: time,
        imgSrc: imageUrl,
        content: content,
        avatar: avatarUrl,
        reading: "0",
        comment: "0",
        type: "二手交易",
        author: nickName,
        time: parseInt(time2.match(reg).join(""))
      },
      success: res => {
        // wx.hideToast()
        wx.showToast({
          title: '发布成功',
        })
        setTimeout(function () {
          wx.switchTab({
            url: "/pages/posts/post",
            success() {
              let page = getCurrentPages().pop();
              if (page == undefined || page == null) {
                return
              }
              page.onLoad();
            }
          })
        }, 1000)
      },
      fail: err => {
        wx.showToast({
          title: '网络开小差了',
          icon: "loading"
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})