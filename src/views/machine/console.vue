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
      cursorBlink: true,
      theme: {
        foreground: '#000000',
        background: '#FFFFF0',
        cursor: 'help',
        lineHeight: 20
      }
    })
    term.open(this.$refs.terminal)

    const socket = new WebSocket('ws://127.0.0.1:8080/devops/ws')
    socket.onopen = () => {
      term.writeln(this.hostname)
    }
    socket.onmessage = (event) => {
      term.writeln(this.hostname + event.data)
    }
    term.onData((data) => {
      socket.send(data)
    })
  }
}
</script>
