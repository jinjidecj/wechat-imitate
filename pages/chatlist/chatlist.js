var myCommon = require('../../utils/common.js')
var myChat = require('../../utils/chatData.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redDot:[0,0],
    slideButtons: [{
      text: '普通',
      src: '../../imgs/agree.png', // icon的路径
    }, {
      type: 'warn',
      text: '警示',
      extClass: 'test',
      src: '../../imgs/agree.png', // icon的路径
    }],
    chatList: [
      // {
      //   id:1,
      //   userId: '1001',
      //   lastMsg: '欠我一毛快还给我啊',
      //   unread:6,
      //   name: 'zzzz',
      //   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/gCiadKP6Xiap4EiaN0FJ2RAHskeHT9AIh3iazYSjslUJC3MX5BrUPwHtzhCWkA6Hpje1Coiccg1Ct3678AVsfDJLHJg/132"
      // },
      // {
      //   id:2,
      //   userId: '1002',
      //   unread: 0,
      //   lastMsg:'你好啊',
      //   name: 'yyyyy',
      //   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/gCiadKP6Xiap4EiaN0FJ2RAHskeHT9AIh3iazYSjslUJC3MX5BrUPwHtzhCWkA6Hpje1Coiccg1Ct3678AVsfDJLHJg/132"
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findAddMsgUnRead()
    var that = this
    //监听websocket事件
    getApp().globalData.webSocket.onMessage(onMessage => {
      console.log("websocket 在chatlist里")
      // var type = JSON.parse(onMessage.type)
      // if (this.data.id == data.targetId) {
      //   this.setDocMsg(data.content)
      // }
      var data = JSON.parse(onMessage.data)
      if (getApp().globalData.whichPage != data.fromId){
        that.getUnReadMsg()
        that.findAddMsgUnRead()
      }
      
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    getApp().globalData.whichPage=0
    var that = this
    this.getUnReadMsg()
    var li = myChat.getChatList()
    if (li != null)
      this.setData({
        chatList: li
      })
  },
  //获取未读消息
  getUnReadMsg:function(){
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.unReadFriendMsgUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if ("200" == res.data.status) {
          var unRead = res.data.data
          // that.setTabbarDotInChatList(0,unRead.length)
          var mapUserId = new Map()
          var mapLastMsg = new Map()
          for(var i in unRead){
            var item = unRead[i]
            //保存个人的未读信息
            myChat.saveOnePChatData({
              userId:item.fromUserId, 
              msg:item.content
            })
            
            if(mapUserId.has(item.fromUserId)){
              mapUserId.set(item.fromUserId, mapUserId.get(item.fromUserId)+1)
            }else{
              mapUserId.set(item.fromUserId, 1)
            }
            mapLastMsg.set(item.fromUserId, item.content)
          }
          that.setChatList(mapUserId,mapLastMsg)
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
  setChatList: function (mapUserId, mapLastMsg){
    //未读消息列表里可能没有这个人，所以就先判断里面有没有这个人
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.allFriendUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey,
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if ("200" == res.data.status) {
          var friends = res.data.data
          var friendsMap = new Map()
          for(var i in friends){
            friendsMap[friends[i].userId]=i
          }
          mapUserId.forEach(function (value, key, map) {
            if (!myChat.hadChatInChatList(key)){
              var yesUser = friends[friendsMap[key]]
              var user = {
                id: yesUser.id,
                unread: 0,
                lastMsg: "",
                avatarUrl: yesUser.avatarUrl,
                name: yesUser.name,
                userId: yesUser.userId,
              }
              myChat.insertChatList(user)
            }
          });

          that.setChatListSafe(mapUserId, mapLastMsg)
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
  setChatListSafe: function (mapUserId, mapLastMsg){
    //进行未读消息的赋值
    mapUserId.forEach(function (value, key, map) {
      console.log(value + " " + key);
      myChat.insertUnReadToChatList(key, value)
    });
    mapLastMsg.forEach(function (value, key, map) {
      myChat.insertLastMsgToChatList(key, value)
    });
    var li = myChat.getChatList()
    if (li != null)
      this.setData({
        chatList: li
      })

    this.setTabbarDotInChatList(0, myChat.getUnReadSumOnChatList())
  },
  clickFriend: function (res) {
    var id = res.currentTarget.id
    console.log("在好友列表里点击了：" + id)
    var user = {
      id: id,
      unread: 0,
      lastMsg: "",
      avatarUrl: "",
      name: "",
      userId: "",
    }
    for (var i in this.data.chatList) {
      var item = this.data.chatList[i]
      if (item.id == id) {
        user.name = item.name
        user.avatarUrl = item.avatarUrl
        user.userId = item.userId
        break;
      }
    }
    myChat.clearUnReadToChatList(user.userId)
    this.setTabbarDotInChatList(0,myChat.getUnReadSumOnChatList())
    // myChat.insertChatList(user)
    wx.navigateTo({
      url: '/pages/chat/chat?id=' + user.id + '&name=' + user.name + '&avatarUrl=' + user.avatarUrl + '&userId=' + user.userId,
    })
  },
  //设置红点
  setTabbarDotInChatList:function(index,num){
    if (num == 0) {
      wx.hideTabBarRedDot({
        index: index
      })
    } else {
      wx.setTabBarBadge({
        index: index,
        text: num + "",
      })
    }
  },
  //查找并设置未读的好友添加请求红点
  findAddMsgUnRead:function(){
    var that = this
    var auth = getApp().getAuth()
    wx.request({
      url: myCommon.myUrl.unReadAddMsgUrl,
      data: {
        openId: auth.openId,
        sessionKey: auth.sessionKey
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if ("200" == res.data.status) {
          that.setTabbarDotInChatList(1,res.data.data)  
          getApp().globalData.unReadAddMsg=res.data.data
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