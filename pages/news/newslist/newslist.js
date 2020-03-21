// pages/news/newslist/newslist.js
var myCommon = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [
    //   {
    //   title: "车祸去世的4位明星",
    //   date: "2020-03-21 13:18",
    //   pic: "https://00imgmini.eastday.com/mobile/20200321/20200321131843_68e7d8ad748179b46a0e943e42d61846_2_mwpm_03200403.jpg"
    // }, {
    //     title: "车祸去世的4位明星，第二位家喻户晓，最后一位葬礼25亿人观看",
    //     date: "2020-03-21 13:18",
    //     pic: "https://00imgmini.eastday.com/mobile/20200321/20200321131843_68e7d8ad748179b46a0e943e42d61846_2_mwpm_03200403.jpg"
    //   },
    ],
    isLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    setTimeout(function(){
      that.getNews()
    },1000)
    
  },
  getNews:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.newsListUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey,
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        console.log(res.data.result)
        if (0 == res.data.error_code) {
          that.setData({
            newsList:res.data.result.data,
            isLoading:false
          })
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