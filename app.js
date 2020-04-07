//app.js
var myCommon = require('/utils/common.js')
import Pubsub from '/utils/pubsub.js'
var webSHandle = require('/utils/webSocketMessage.js')

App({
  globalData: {
    userInfo: null,
    pubsub:null,
    openId:'',
    userId:'',
    sessionKey:'',
    webSocket:null,
    unReadAddMsg:0,
    whichPage:0,//0-chatList  1-chat  2-friends
  },
  //用户登录逻辑：微信登录接口-获取code，发送到后台获取openId,sessionKey并保存到本地,
  //成功后获取个人信息,发送到后台进行保存或更新，成功后启动websocket连接
  onLaunch: function () {
    this.globalData.pubSub = new Pubsub()
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
    // this.showTabbarDot()
    this.globalData.pubSub.on('getAuth', (number) => {
      this.getUserInfo()
    });
  },
  showTabbarDot: function () {
    console.log("dot")
    wx.showTabBarRedDot({
      index:1,
      success:function(res){
        console.log(res)
      },
      fail: function (res){
        console.log(res)
      },
      complete: function (res){
        console.log(res)
      }
    })
  },
  //================个人信息================//
  //获取用户信息
  getUserInfo:function(){
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("have auth")
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
        }else{
          console.log("no auth")
          that.globalData.pubSub.emit('noAuth', true);
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
        console.log("成功获取登录凭证")
        console.log(res.data)
        if ("200" == res.data.status) {
          that.saveAuth(res.data.openid, res.data.session_key)
          // 获取用户信息
          that.getUserInfo()
        }
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
        if ("200" == res.data.status){
          console.log("更新个人信息成功")
          // wx.showToast({
          //   icon: 'none',
          //   title: '登录成功',
          // })
          that.ifRegist()
          that.connectWebSocket()
        }
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
  //判断是否注册过--判断是否填写了个人id
  ifRegist:function(){
    var that = this
    var auth = this.getAuth()
    wx.request({
      url: myCommon.myUrl.ifRegistUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey,
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if ("200" == res.data.status) {
          console.log(res.data.msg)
          that.globalData.userId=res.data.userId
          if(that.isLogin)
            that.isLogin({
              flag:true,
              userId:res.data.userId
            })
        }
        else {
          console.log(res.data.msg)
          if (that.isLogin)
            that.isLogin({
              flag: false
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
  //================openid================//
  saveAuth: function (openId, sessionKey) {
    this.globalData.openId = openId
    this.globalData.sessionKey = sessionKey
    console.log("保存登录凭证")
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
  setUserId:function(userId){
    this.globalData.userId=userId
  },
  getUserId: function () {
    return this.globalData.userId
  },
  //=================websocket================//
  //启动WebSocket
  connectWebSocket:function () {
    var that = this
    var url = myCommon.myUrl.webSocketUrl + this.getAuth().openId
    setTimeout(function () {
      that.globalData.webSocket = wx.connectSocket({
          url: url  
      })
      console.log("启动websocket:"+url)
    }, 500)
    //监听连接成功事件
    wx.onSocketOpen(function (res) {
      console.log("连接成功")
      that.sendMsg({
        type:1,
      })
    })
    //监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function (res) {
      // webSHandle.onMessageHandle(res)
      that.globalData.pubSub.emit('websocket', res);
    })
    //监听连接关闭事件
    wx.onSocketClose(function (res) {
      console.log("连接关闭")
      console.log(res)
    })
  },
  //关闭连接
  closeWebSocket:function () {
    wx.closeSocket({})
  },
  //发送信息
  sendMsg:function (data) {
    var that = this
    wx.sendSocketMessage({
      data: JSON.stringify({
        openId: this.getAuth().openId,
        sessionKey: this.getAuth().sessionKey,
        data: data
      })
    })
  },
})