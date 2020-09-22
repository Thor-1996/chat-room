<template>
  <div class="chat-room">
    <div class="online-count">当前在线人数：{{ onlineCount }}</div>
    <div v-for="item in msgList" class="msg" :key="`${item.time}${item.key}`">
      <div v-if="item.isSelf" class="self">{{ item.msg }} 我</div>
      <div v-else class="un-self">
        游客{{ item.key.slice(0, 4) }}：{{ item.msg }}
      </div>
    </div>

    <div class="bottom">
      <el-input
        class="input"
        v-model="msg"
        size="small"
        placeholder="说点什么吧..."
        @keyup.enter.native="sendMsg"
      ></el-input>
      <el-button class="button" type="primary" size="small" @click="sendMsg"
        >发送</el-button
      >
    </div>
  </div>
</template>

<script>
let connecTimes = 0;

export default {
  name: "HelloWorld",
  data() {
    return {
      msgList: [],
      msg: "",
      onlineCount: 0
    };
  },
  methods: {
    validateMsg() {
      if (!this.msg || !this.msg.trim()) {
        this.$message({
          type: "error",
          message: "发送消息不能为空"
        });
        return false;
      }

      return true;
    },
    sendMsg() {
      if (!this.validateMsg()) return;

      this.ws.send(this.msg);
      this.msg = "";
    },
    initWebSocket() {
      this.ws = new WebSocket("ws://49.232.165.76:8001");

      this.ws.onopen = e => {
        console.log(e, "建立连接");
      };

      this.ws.onmessage = e => {
        const res = JSON.parse(e.data);
        connecTimes++;

        if (connecTimes === 1) {
          this.WebSocketId = res.key;
        }

        if (res.type === "MSG") {
          this.msgList.push({
            ...res,
            isSelf: this.WebSocketId === res.key
          });
        }

        if (res.type === "COUNT") {
          this.onlineCount = res.count;
        }
      };
    }
  },
  created() {
    this.initWebSocket();
  }
};
</script>

<style scoped lang="scss">
.chat-room {
  word-break: break-all;
  .self {
    text-align: right;
  }
  .un-self {
    text-align: left;
  }
  .online-count {
    text-align: center;
  }
  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
  }
  .input {
    flex: 1 1 auto;
  }
  .button {
    flex: 0 0 auto;
  }
}
</style>
