// let ws = require("nodejs-websocket");
// let onlineCount = 0;
// const COUNT = "COUNT";
// const MSG = "MSG";

// const server = ws
//   .createServer(function (conn) {
//     onlineCount++;

//     boardcast({
//       type: COUNT,
//       count: onlineCount,
//       key: conn.key,
//     });

//     conn.on("text", function (str) {
//       const time = +new Date();

//       boardcast({
//         type: MSG,
//         key: conn.key,
//         time,
//         msg: str,
//       });
//     });

//     conn.on("close", function (code, reason) {
//       onlineCount--;

//       boardcast({
//         type: COUNT,
//         count: onlineCount,
//         key: conn.key,
//       });
//     });

//     conn.on("error", function (code, reason) {
//       console.log("异常关闭");
//     });
//   })
//   .listen(8001);

// function boardcast(obj) {
//   server.connections.forEach(function (conn) {
//     conn.send(JSON.stringify(obj));
//   });
// }

var https = require("https");
var ws = require("ws");
var fs = require("fs");
var keypath = process.cwd() + "\\2_chat.webliker.cn.key";
var certpath = process.cwd() + "\\1_chat.webliker.cn_bundle.crt";

var options = {
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath),
};

var server = https
  .createServer(options, function (req, res) {
    res.writeHead(403);
    res.end("This is a  WebSockets server!\n");
  })
  .listen(8001);

var wss = new ws.Server({ server: server });
wss.on("connection", function (wsConnect) {
  wsConnect.on("message", function (message) {
    console.log(message);
  });
});
