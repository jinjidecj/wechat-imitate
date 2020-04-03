Page({

  data: {
    persionId:'',
    isLogin:false
  },
  inputId:function(res){
    this.setData({
      persionId:res.detail.value
    })
  },
  clickBtn:function(){
    console.log(this.data.persionId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var flag = wx.getStorage("flag")
    var that = this
    // if(flag==1){
    //   wx.switchTab({
    //     url: '../index/index',
    //   })
    // }else{
      
    // }
    Toast.loading({
      duration: 0,//展示时长(ms)，值为 0 时，toast 不会消失
      mask: true,
      message: '登录中...'
    });
    getApp().isLogin = function (res) {
      console.log("run login")
      Toast.clear()//清除toast
      if(res==true){
        //注册过了
        wx.switchTab({
          url: '../index/index',
        })
      }else{
        //没注册过
        that.setData({
          isLogin: true
        })
      }
      
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  
})