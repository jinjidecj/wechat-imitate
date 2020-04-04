// 公共变量和函数
var ip='127.0.0.1'
var serverIp='115.29.151.221'
var port='8090'

var nowIp = ip

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
}

module.exports={
  myUrl:myUrl,
}