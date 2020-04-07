// 公共变量和函数
var ip='127.0.0.1'
var serverIp='115.29.151.221'
var localIp = '192.168.2.115'
var port='8090'

var nowIp = serverIp

var headUrl = 'http://'+nowIp+':'+port+'/'
var myUrl = {
  // webSocketUrl: 'ws://127.0.0.1:8090/websocket/', 
  webSocketUrl: 'ws://' + nowIp + ':' + port +'/websocket/',
  sendCodeUrl: headUrl+ 'sendCode',
  userInfoUrl:headUrl+'userInfo',
  newsListUrl: headUrl +'newsList',
  getAllUserUrl:headUrl+'allUser',
  ifRegistUrl:headUrl+'isRegister',
  registerUrl: headUrl +'register',
  findFriendUrl: headUrl +'findFriend',
  addFriendUrl: headUrl +'addFriend',
  myAddFriendMsgUrl: headUrl +'myAddMsg',
  addMsgReslutUrl: headUrl +'addMsgResult',
  allFriendUrl: headUrl +'allFriend',
  unReadAddMsgUrl: headUrl + 'unReadAddMsg',
  readAllAddMsgUrl: headUrl + 'readAllAddMsg',
  unReadFriendMsgUrl: headUrl + 'unreadFriendMsg', 
}

module.exports={
  myUrl:myUrl,
}