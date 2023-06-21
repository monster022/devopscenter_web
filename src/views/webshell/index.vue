<template>
  <div id="terminal" class="console" />
</template>
<script>
import { Terminal } from 'xterm'
export default {
  name: 'Webssh',
  data() {
    return {
      term: null,
      terminalSocket: null,
      order: ''
    }
  },
  mounted() {
    const terminalContainer = document.getElementById('terminal')
    // 创建xterm实例
    this.term = new Terminal({
      cursorBlink: true, // 显示光标
      cursorStyle: 'underline' // 光标样式
    }) // 创建一个新的Terminal对象
    this.term.open(terminalContainer) // 将term挂载到dom节点上

    console.log(this.term)
    // 在xterm上面显示命令行命令 (预设显示)
    this.term.write('$ ')
    // 监听xterm的键盘事件
    this.term.on('key', (key, ev) => {
      // key是输入的字符，ev是键盘的按键事件
      console.log('key======', ev.keyCode)
      // 将输入的字符打印到命令窗口中
      this.term.write(key)
      if (ev.keyCode === 13) { // 输入回车（ASCII 13是回车）
        this.terminalSocket.send(this.order) // 发送数据到后台
        // this.order = ''
        console.log('里面的order', this.order)
      } else if (ev.keyCode === 8) { // 删除按钮（ASCII 8是删除）
        this.order = this.order.substr(0, this.order.length - 1)
        // 清空当前一条的命令
        this.term.write('\x1b[2K\r')
        // 简化当前新的命令，显示在命令窗中
        this.term.write('$ ' + this.order)
        console.log('截取的字符串：' + this.order)
        typeof this.order
      } else { // 将每次输入的字符串拼接起来
        this.order += key
        console.log('外面的order', this.order)
      }
    })
    // 实例化一个websocket，用于和django江湖
    this.terminalSocket = new WebSocket('ws://127.0.0.1:8080/devops/ws')
    // 获取到后端传回的信息
    this.terminalSocket.onmessage = (res) => {
      console.log(res.data)
      // var message = JSON.parse(res.data);
      // 将传回来的数据显示在xterm里
      this.term.writeln('\r\n' + res.data)
      // 重置要发送的信息
      this.order = ''
      // 换行，显示下一个开头
      this.term.write('\r\n$ ')
    }
  },
  methods: {
  }
}

</script>
