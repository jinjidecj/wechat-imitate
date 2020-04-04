// pages/friends/friends.js
var myCommon = require('../../utils/common.js')
var myChat = require('../../utils/chatData.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgNum:0,
    friends: [
      // {
      //   name: 'zzzz',
      //   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/gCiadKP6Xiap4EiaN0FJ2RAHskeHT9AIh3iazYSjslUJC3MX5BrUPwHtzhCWkA6Hpje1Coiccg1Ct3678AVsfDJLHJg/132"
      // },
      // {
      //   name: 'yyyyy',
      //   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/gCiadKP6Xiap4EiaN0FJ2RAHskeHT9AIh3iazYSjslUJC3MX5BrUPwHtzhCWkA6Hpje1Coiccg1Ct3678AVsfDJLHJg/132"
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFriends()
  },
  clickNewFriend:function(){
    wx.navigateTo({
      url: '../newFriend/newFriend',
    })
    
  },
  clickFriend: function (res) {
    var id = res.currentTarget.id
    console.log("在好友列表里点击了：" + id)
    var user = {
      id:id,
      avatarUrl:"",
      name:"",
    }
    for(var i in this.data.friends){
      var item = this.data.friends[i]
      if (item.id == id){
        user.name = item.name
        user.avatarUrl = item.avatarUrl
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/chat/chat?id=' + user.id+'&name='+user.name+'&avatarUrl='+user.avatarUrl,
    })
  },
  getFriends:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.getAllUserUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey,
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          friends:res.data
        })
        myChat.saveFriendsList(res.data)
      },
      fail: function (error) {
        console.log(error)
        wx.showToast({
          icon: 'none',
          title: '请检查网络',
        })
      }
    })
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