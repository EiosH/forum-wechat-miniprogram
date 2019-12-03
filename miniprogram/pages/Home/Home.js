// var postsData = require('../../data/posts-data.js')
const app = getApp();
const db = wx.cloud.database()
var getCity = require('../../data/city.js');

var nickName;
var avatarUrl;
var sex;
var gender;
var city;
var country;
var province;
// var that = this;
Page({

  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生的
    logged: true
  },

  onLoad: function(options) {
    var that = this
    wx.getUserInfo({
      success: function(res) {
        nickName = res.userInfo.nickName
        avatarUrl = res.userInfo.avatarUrl
        sex = res.userInfo.gender
        gender =sex
        city = res.userInfo.city
        country = res.userInfo.country
        province = res.userInfo.province
        sex == 1 ? sex = "../../images/icon/man.svg" : sex = "../../images/icon/woman.svg"
        gender == 1 ? gender="男":"女"
        var my_city = getCity(city);
        that.setData({
          nickName: nickName,
          avatarUrl: avatarUrl,
          sex: sex,
          city: my_city
        })
        db.collection('user').add({              //记录访问者
          data:{
            name: nickName,
            sex: gender,
            city: country +"国"+ province+"省"+my_city
          }
        })
      }
    })
  },
  collect: function () {
    wx.navigateTo({
      url: 'my-collect/my-collect'
    })
  },
  comment: function () {
    wx.navigateTo({
      url: 'my-comment/my-comment'
    })
  },
  post: function () {
    wx.navigateTo({
      url: 'my-post/my-post'
    })
  },
  Administrator:function(){
    wx.navigateTo({
      url: 'my-Administrator/my-Administrator'
    })
  },
  onReady: function() {

  },


})