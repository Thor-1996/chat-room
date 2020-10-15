let https = require("https");
let ws = require("ws");
let fs = require("fs");
let keypath = process.cwd() + "/2_chat.webliker.cn.key";
let certpath = process.cwd() + "/1_chat.webliker.cn_bundle.crt";

let onlineCount = 0;
const clientList = [];
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
wss.on("connection", function (conn, req) {
  const key = req.socket.remoteAddress;

  if (!clientList.includes(key)) {
    clientList.push(key);
    onlineCount++;
  }

  boardcast({
    type: COUNT,
    count: onlineCount,
    key,
  });

  conn.on("message", function (message) {
    const time = +new Date();

    boardcast({
      type: MSG,
      key,
      time,
      msg: message,
    });
  });

  conn.on("close", function () {
    if (!clientList.includes(key)) {
      clientList.push(key);
      onlineCount--;
    }

    boardcast({
      type: COUNT,
      count: onlineCount,
      key,
    });
  });
});

function boardcast(obj) {
  wss.clients.forEach(function (client) {
    client.send(JSON.stringify(obj));
  });
}
