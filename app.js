//app.js
var myCommon = require('/utils/common.js')

App({
  globalData: {
    userInfo: null,
    openId:'',
    sessionKey:''
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.sendCode(res.code)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              that.sendUserInfo(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //发送code到后台，获取登录凭证
  sendCode:function(code){
    var that = this
    wx.request({
      url: myCommon.myUrl.sendCodeUrl,
      data: {
        code: code
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if ("200" == res.data.status)
          that.saveAuth(res.data.openid, res.data.session_key)
        else {
          wx.showToast({
            icon: 'none',
            title: '登录错误，请联系管理员',
          })
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
  //发送个人信息到后台
  sendUserInfo: function (userInfo) {
    console.log("ffff")
    var that = this
    var auth = this.getAuth()
    wx.request({
      url: myCommon.myUrl.userInfoUrl,
      data: {
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        name: userInfo.nickName,
        openId: auth.openId,
        sessionKey: auth.sessionKey,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if ("200" == res.data.status)
          console.log("更新成功")
        else {
          wx.showToast({
            icon: 'none',
            title: '更新个人信息错误，请联系管理员',
          })
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
  saveAuth: function (openId, sessionKey) {
    this.globalData.openId = openId
    this.globalData.sessionKey = sessionKey
  },
  ifHaveAuth: function () {
    if (this.globalData.sessionKey == '') {
      return false
    }
    return true
  },
  getAuth: function () {
    return {
      openId: this.globalData.openId,
      sessionKey: this.globalData.sessionKey
    }
  },
})