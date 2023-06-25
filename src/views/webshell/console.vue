<template>
  <div>
    <div ref="terminal" />
  </div>
</template>

<script>
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

export default {
  mounted() {
    const term = new Terminal({
      // rendererType: 'dom', // 渲染类型
      rows: 30, // 行数
      cols: 80, // 不指定行数，自动回车后光标从下一行开始
      convertEol: true, // 启用时，光标将设置为下一行的开头
      scrollback: 50, // 终端中的回滚量
      disableStdin: false, // 是否应禁用输入
      windowsMode: true, // 根据窗口换行
      cursorStyle: 'underline', // 光标样式
      cursorBlink: true // 光标闪烁
      // theme: {
      //   foreground: '#000000', // 字体
      //   background: '#FFFFF0', // 背景色
      //   cursor: 'help', // 设置光标
      //   lineHeight: 20
      // }
    })
    term.open(this.$refs.terminal)

    const socket = new WebSocket('ws://127.0.0.1:8080/devops/ws')
    socket.onopen = () => {
      term.writeln('[root@127.0.0.1 ~]$ ')
    }
    socket.onmessage = (event) => {
      term.writeln('[root@127.0.0.1 ~]$ \n' + event.data)
    }
    // term.onData((data) => {
    //   socket.send(data)
    // })
    let str01 = ''
    let str02 = ''
    term.onKey(e => {
      // 获取键盘输入的字符
      const char = e.key
      str01 = str01 + char
      // 判断是否为回车键
      if (char === '\r' || char === '\n') {
        str02 = str01
        str01 = ''
        // console.log(str02)
        // 执行回车操作，比如发送命令
        term.write('\r\n')
        // 提交接口信息
        socket.send(str02)
      } else {
        // 将字符写入终端
        term.write(char)
      }
    })
  }
}
</script>
