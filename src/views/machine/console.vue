<template>
  <div>
    <div ref="terminal" />
  </div>
</template>

<script>
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

export default {
  props: {
    hostname: {
      type: String,
      default: '[root@127.0.0.1 ~]$ '
    },
    ip: {
      type: String,
      default: '127.0.0.1'
    },
    name: {
      type: String,
      default: 'root'
    }
  },
  mounted() {
    const term = new Terminal({
      rows: 30,
      cols: 80,
      convertEol: true,
      scrollback: 50,
      disableStdin: false,
      windowsMode: true,
      cursorStyle: 'underline',
      cursorBlink: true
    })
    term.open(this.$refs.terminal)

    const socket = new WebSocket('ws://127.0.0.1:8080/devops/' + this.ip + '/' + this.name + '/bash/ws')
    // 远程调试
    // const socket = new WebSocket('ws://10.11.11.41:8080/devops/ws')
    socket.onopen = () => {
      term.write(this.hostname)
    }
    socket.onmessage = (event) => {
      term.writeln(event.data)
      term.write(this.hostname)
    }
    let str01 = ''
    let str02 = ''
    term.onKey(e => {
      const char = e.key
      str01 = str01 + char
      if (char === '\r' || char === '\n') {
        str02 = str01
        str01 = ''
        term.write('\r\n')
        socket.send(str02)
      } else {
        term.write(char)
      }
    })
  }
}
</script>
