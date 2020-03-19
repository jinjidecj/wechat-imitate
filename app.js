//app.js
var myCommon = require('/utils/common.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        var headUrl = 'http://127.0.0.1:8080/'
        var myUrl = {
          sendCodeUrl: headUrl + 'sendCode',
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(myUrl.sendCode)
        wx.request({
          url: 'http://127.0.0.1:8080/sendCode',
          data:{
            code:res.code
          },
          method: 'GET',
          success:function(res){
            console.log(res)
          },

          fail: function (error) {
            console.log(error)
            wx.showToast({
              icon: 'none',
              title: '请检查网络',
            })
          }
        })
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
              console.log(res)
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
  globalData: {
    userInfo: null
  }
})