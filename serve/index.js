let https = require("https");
let ws = require("ws");
let fs = require("fs");
let keypath = process.cwd() + "/2_chat.webliker.cn.key";
let certpath = process.cwd() + "/1_chat.webliker.cn_bundle.crt";

let onlineCount = 0;
const COUNT = "COUNT";
const MSG = "MSG";

const options = {
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath),
};

const server = https
  .createServer(options, function (req, res) {
    res.writeHead(403);
    res.end("This is a  WebSockets server!\n");
  })
  .listen(8001);

const wss = new ws.Server({ server: server });
wss.on("connection", function (conn) {
  console.log(conn);
  onlineCount++;

  boardcast({
    type: COUNT,
    count: onlineCount,
    key: conn.key,
  });

  conn.on("message", function (message) {
    const time = +new Date();

    boardcast({
      type: MSG,
      key: conn.key,
      time,
      msg: message,
    });
  });

  conn.on("close", function () {
    onlineCount--;

    boardcast({
      type: COUNT,
      count: onlineCount,
      key: conn.key,
    });
  });
});

function boardcast(obj) {
  wss.clients.forEach(function (client) {
    client.send(JSON.stringify(obj));
  });
}
