// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
    speaker: 'server',
    contentType: 'text',
    content: '向我发送消息，当我在线的时候才能收到哦~'
  },
  {
    speaker: 'customer',
    contentType: 'text',
    content: '这是示例消息'
  }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initData(this);
    this.setData({
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
      id: options.id,
      name: options.name,
      avatarUrl: options.avatarUrl
    });
    wx.setNavigationBarTitle({
      title: this.data.name,
    });
    //监听websocket事件
    getApp().globalData.webSocket.onMessage(onMessage => {
      var data = JSON.parse(onMessage.data)
      if(this.data.id==data.targetId){
        this.setDocMsg(data.content)
      }
      
    })
  },


  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
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
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
    getApp().sendMsg({
      type:2,
      targetId:this.data.id,
      content:e.detail.value
    })
  },
  //按下发送按钮时
  sendClickBtn: function () {
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: this.data.inputData
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
    getApp().sendMsg({
      type: 2,
      id: this.data.id,
      content: this.data.inputData
    })
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
  setDocMsg: function (msg) {
    msgList.push({
      speaker: 'server',
      contentType: 'text',
      content: msg
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
  }
  
})
