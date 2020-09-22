let ws = require("nodejs-websocket");
let onlineCount = 0;
const COUNT = "COUNT";
const MSG = "MSG";

const server = ws
  .createServer(function (conn) {
    onlineCount++;

    boardcast({
      type: COUNT,
      count: onlineCount,
      key: conn.key,
    });

    conn.on("text", function (str) {
      const time = +new Date();

      boardcast({
        type: MSG,
        key: conn.key,
        time,
        msg: str,
      });
    });

    conn.on("close", function (code, reason) {
      onlineCount--;

      boardcast({
        type: COUNT,
        count: onlineCount,
        key: conn.key,
      });
    });

    conn.on("error", function (code, reason) {
      console.log("异常关闭");
    });
  })
  .listen(8001);

function boardcast(obj) {
  server.connections.forEach(function (conn) {
    conn.send(JSON.stringify(obj));
  });
}
