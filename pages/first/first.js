var myCommon = require('../../utils/common.js')
Page({

  data: {
    persionId:'',
    isLogin:false,
    loginLoad: 0,
    showPop: false,
  },
  inputId:function(res){
    this.setData({
      persionId:res.detail.value
    })
  },
  clickBtn:function(){
    if(this.data.persionId==""){
      wx.showToast({
        icon: 'none',
        title: '请填写ID',
      })
      return
    }
    console.log(this.data.persionId)
    this.register(this.data.persionId)
  },
  register: function (persionId) {
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.registerUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey,
        userId: persionId
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if ("200" == res.data.status) {
          wx.showToast({
            icon: 'none',
            title: '注册成功',
          })
          getApp().setUserId(persionId)
          wx.switchTab({
            url: '../index/index',
          })
        }
        else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    getApp().isLogin = function (res) {
      that.setData({
        loginLoad:100
      })
      console.log("run login")
      // that.setData({
      //   isLogin: true
      // })
      if(res.flag==true){
        //注册过了
        getApp().setUserId(res.userId)
        wx.switchTab({
          url: '../chatlist/chatlist',
        })
      }else{
        //没注册过
        that.setData({
          isLogin: true
        })
      }
    }
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    setInterval(() => {
      if (this.data.loginLoad <= 99) {
        
        this.setData({
          loginLoad:this.data.loginLoad+1
        })
      } else {
        
        clearInterval(this.countTimer);
      }
    }, 50)

    getApp().globalData.pubSub.on('noAuth', (number) => {
      this.setData({
        showPop: true
      });
    });
  },
  //微信登录，先弹出授权
  onGotUserInfo: function (e) {
    var that = this
    if (e.detail.userInfo) //如果用户允许授权，即点击了“允许"
    {
      getApp().globalData.pubSub.emit('getAuth', true);
      this.setData({
        showPop: false
      });
      //console.log("授权了");
      // wx.getUserInfo({//授权后可以通过wx.getUserInfo得到用户信息
      //   lang: "zh_CN",
      //   success: res => {
      //     //如果用户点击了授权，可以直接获取到信息
      //     //console.log(res.userInfo)
          
      //   }
      // })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  
})