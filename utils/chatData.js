//聊天列表
function saveChatList(res){
  wx.setStorage({
    key: 'chatList',
    data: JSON.stringify(res),
  })
}
function getChatList(){
  return JSON.parse(wx.getStorageSync('chatList'))
}

//与一个人的聊天内容
function savePersonChatData(res){
  wx.setStorage({
    key: res.userId,
    data: JSON.stringify(res.data),
  })
}
function getPersonChatData(userId){
  return JSON.parse(wx.getStorageSync(userId))
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
  savePersonChatData,
  getPersonChatData,
  saveFriendsList,
  getFriendsList
}