// 公共变量和函数
var headUrl = 'http://127.0.0.1:8080/'
var myUrl = {
  webSocketUrl: 'ws://127.0.0.1:8080/websocket/',
  sendCodeUrl: headUrl+ 'sendCode',
  userInfoUrl:headUrl+'userInfo',
  newsListUrl: headUrl +'newsList',
  getAllUserUrl:headUrl+'allUser',
}

module.exports={
  myUrl:myUrl,
}