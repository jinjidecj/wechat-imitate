// pages/newFriend/newFriend.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var myCommon = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:'',
    showPop: false,
    node:'',
    userSearch:{
      gender:1,
      name: '王骞',
      userId:'1001',
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/gCiadKP6Xiap4EiaN0FJ2RAHskeHT9AIh3iazYSjslUJC3MX5BrUPwHtzhCWkA6Hpje1Coiccg1Ct3678AVsfDJLHJg/132"
    },
    friendsRequestMsg:[],
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.getAddFriendMsgList()
  },
  //从服务器获取我的好友请求消息队列
  getAddFriendMsgList:function(){
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.myAddFriendMsgUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey
      },
      method: 'GET',
      success: function (res) {
        Toast.clear();
        console.log("获得消息列表")
        console.log(res.data)
        if ("200" == res.data.status) {
          
          that.setData({
            friendsRequestMsg: res.data.addMsg,
          })
          Toast.success("查找成功")
        }
        else {
          Toast.fail('没有好友消息');
        }
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
  //搜索触发函数
  onSearch:function(e){
    Toast.loading({
      duration: 0,
      mask: true,
      message: '搜索中...'
    });
    this.setData({
      searchValue:e.detail,
    })
    this.sendFriendUserId(e.detail)
    // console.log(e.detail)
  },
  //搜索好友，发送userId
  sendFriendUserId(userId){
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.findFriendUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey,
        friendUserId: userId
      },
      method: 'GET',
      success: function (res) {
        Toast.clear();
        console.log(res.data)
        if ("200" == res.data.status) {
          var friend = {
            name: res.data.name,
            userId: res.data.userId,
            avatarUrl: res.data.avatarUrl
          }
          that.setData({
            userSearch:res.data,
            showPop: true
          })
          Toast.success("查找成功")
        }
        else {
          Toast.fail('不存在此用户');
        }
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
  //确定添加好友按钮
  confirmAdd:function(){
    console.log(this.data.node)
    this.sendAddFriendRequest(this.data.node)
  },
  //发送添加好友请求
  sendAddFriendRequest:function(node){
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.addFriendUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey,
        friendUserId: that.data.userSearch.userId,
        node: node
      },
      method: 'POST',
      success: function (res) {
        Toast.clear();
        console.log(res.data)
        if ("200" == res.data.status) {
          that.setData({
            showPop: false,
            node:'',
            searchValue:''
          })
          Toast.success("发送成功")
        }
        else {
          Toast.fail('发送失败');
        }
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
  //取消添加好友，隐藏弹出框
  cancelAdd:function(){
    this.setData({
      showPop: false
    })
  },
  inputId: function (res) {
    this.setData({
      node: res.detail.value
    })
  },
  onCancel: function () {
    this.setData({
      searchValue: ''
    })
  },
  onCloseShowPop() {
    this.setData({ show: false });
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