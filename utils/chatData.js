//聊天列表
function saveChatList(res){
  wx.setStorage({
    key: 'chatList',
    data: JSON.stringify(res),
  })
}
function getChatList(){
  var str = wx.getStorageSync('chatList')
  console.log(str)
  if(str!="")
    return JSON.parse(str)
  else
    return null
}
//插入一个聊天列表，如果有了就不插入
function insertChatList(user){
  var charList = getChatList()
  var flag = 0
  if(charList!=null){
    for (var i in charList) {
      var item = charList[i]
      if (item.userId == user.userId) {
        flag = 1
        break;
      }
    }
    //如果为1则不插入
    if (flag == 0) {
      charList.push(user)
      saveChatList(charList)
    }
  }else{
    saveChatList([user])
  }
}
//判断在聊天列表里是否有这个人了
function hadChatInChatList(userId){
  var charList = getChatList()
  var flag = 0
  if (charList != null) {
    for (var i in charList) {
      var item = charList[i]
      if (item.userId == userId) {
        flag = 1
        break;
      }
    }
    //如果为1则不插入
    if (flag == 1) {
      return true
    }
    return false
  } else {
    return false
  }
}
//根据用户的id插入这个聊天框的最后一句话
function insertLastMsgToChatList(userid,msg){
  console.log(userid+' '+msg)
  var charList = getChatList()
  var flag = 0
  if (charList != null) {
    for (var i in charList) {
      var item = charList[i]
      if (item.userId == userid) {
        item.lastMsg = msg
        flag = 1
        break;
      }
    }
    //如果为1则不插入
    if (flag == 1) {
      saveChatList(charList)
    }
  }
}
//根据用户的Userid插入这个聊天框的未读消息数目
function insertUnReadToChatList(userid, num) {
  console.log(userid + ' ' + num)
  var charList = getChatList()
  var flag = 0
  if (charList != null) {
    for (var i in charList) {
      var item = charList[i]
      if (item.userId == userid) {
        item.unread = num+item.unread
        flag = 1
        break;
      }
    }
    //如果为1则不插入
    if (flag == 1) {
      saveChatList(charList)
    }
  }
}
//根据用户的Userid清除这个聊天框的未读消息数目
function clearUnReadToChatList(userid) {
  var charList = getChatList()
  var flag = 0
  if (charList != null) {
    for (var i in charList) {
      var item = charList[i]
      if (item.userId == userid) {
        item.unread =0
        flag = 1
        break;
      }
    }
    //如果为1则不插入
    if (flag == 1) {
      saveChatList(charList)
    }
  }
}
//获取现有聊天框的未读消息数目总和
function getUnReadSumOnChatList() {
  var charList = getChatList()
  var sumUnRead= 0
  if (charList != null) {
    for (var i in charList) {
      var item = charList[i]
      sumUnRead = sumUnRead+item.unread 
    }
  }
  return sumUnRead
}
//与一个人的聊天内容
function savePersonChatData(res){
  wx.setStorage({
    key: res.userId,
    data: JSON.stringify(res.data),
  })
}
function getPersonChatData(userId){
  var str = wx.getStorageSync(userId)
  console.log(str)
  if (str !=null && str != "")
    return JSON.parse(str)
  else
    return null
}
//保存一个人的消息 res:{userId:'',msg:''} 
function saveOnePChatData(res) {
  var chatData = getPersonChatData(res.userId)
  console.log("a p data")
  console.log(chatData)
  if(chatData!=null){
    chatData.push({
      speaker: 'server',
      contentType: 'text',
      content: res.msg
    })
    savePersonChatData({
      userId:res.userId,
      data:chatData
    })
  }else{
    savePersonChatData({
      userId: res.userId,
      data: [{
        speaker: 'server',
        contentType: 'text',
        content: res.msg
      }]
    })
  }
}
//好友列表
function saveFriendsList(res){
  wx.setStorage({
    key: 'friendsList',
    data: JSON.stringify(res),
  })
}
function getFriendsList(){
  return JSON.parse(wx.getStorageSync(friendsList))
}

module.exports = {
  saveChatList,
  getChatList,
  insertChatList,
  insertLastMsgToChatList,
  clearUnReadToChatList,
  getUnReadSumOnChatList,
  insertUnReadToChatList,
  saveOnePChatData,
  hadChatInChatList,
  savePersonChatData,
  getPersonChatData,
  saveFriendsList,
  getFriendsList
}