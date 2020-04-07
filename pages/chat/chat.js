// pages/contact/contact.js
const app = getApp();
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var myChat = require('../../utils/chatData.js')


/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    id: "",
    name: '',
    avatarUrl: '',
    inputData: '',
    userId:'',
    msgList:[],
    inputVal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
      id: options.id,
      name: options.name,
      avatarUrl: options.avatarUrl,
      userId: options.userId
    });
    wx.setNavigationBarTitle({
      title: this.data.name,
    });
    this.getChat(options.userId)
    //监听websocket事件
    // getApp().globalData.webSocket.onMessage(onMessage => {
    //   console.log("websocket 在chat里")
    //   console.log(onMessage)
    //   var data = JSON.parse(onMessage.data)
    //   if(this.data.id==data.fromId){
    //     this.setDocMsg(data.content)
    //   }
      
    // })
  },
  onHide:function(){
    getApp().globalData.pubSub.off('chat')
  },
  onShow: function () {
    getApp().globalData.whichPage = 1
    var that = this
    getApp().globalData.pubSub.on('chat', (mapUserId) => {
      //chatlist更新了他自己的列表，
      //判断有没有更新当前用户的
      
        //有则更新当前数据列表
      that.getChat(that.data.userId)
        //然后清除未读数目
      myChat.clearUnReadToChatList(that.data.userId)
      
    });
  },
  getChat:function(userId){
    var li = myChat.getPersonChatData(userId)
    if (li != null)
      this.setData({
        msgList: li
      })
  },
  saveChat: function (msgList){
    console.log(this.data.userId + "  " + msgList)
    myChat.savePersonChatData({
      userId:this.data.userId,
      data: msgList
    })
  },
  setDocMsg: function (msg) {
    var msgHad = this.data.msgList
    msgHad.push({
      speaker: 'server',
      contentType: 'text',
      content: msg
    })
    this.setData({
      msgList: msgHad,
      inputVal:''
    });
    myChat.insertLastMsgToChatList(this.data.userId,msg)
    this.saveChat(msgHad)
  },
  /**
     * 发送点击监听
     */
  sendClick: function (e) {
    if(e.detail.value==""){
      return
    }
    console.log("chakan ")
    var msgHad = this.data.msgList
    console.log(msgHad)
    msgHad.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    this.setData({
      msgList: msgHad,
      inputVal:''
    });
    getApp().sendMsg({
      type: 2,
      targetId: this.data.id,
      content: e.detail.value
    })
    myChat.insertLastMsgToChatList(this.data.userId, e.detail.value)
    this.saveChat(msgHad)
  },

  //==============origin function=====================//
  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    })

  },

  
  //按下发送按钮时
  sendClickBtn: function () {
    var that = this
    this.sendClick({
      detail:{
        value: that.data.inputData
      }
    })
    // msgList.push({
    //   speaker: 'customer',
    //   contentType: 'text',
    //   content: this.data.inputData
    // })
    // inputVal = '';
    // this.setData({
    //   msgList,
    //   inputVal
    // });
    // getApp().sendMsg({
    //   type: 2,
    //   targetId: this.data.id,
    //   content: this.data.inputData
    // })
  },
  //记录输入的数据
  inputDataFunc: function (e) {
    this.setData({
      inputData: e.detail.value
    })
  },
  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  },
  
})
