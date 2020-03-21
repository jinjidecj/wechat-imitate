//处理WebSocket从服务器接收的消息
function onMessageHandle(data) {
  console.log("收到服务器信息")
  console.log(data)
}


module.exports = {
  onMessageHandle: onMessageHandle,
}