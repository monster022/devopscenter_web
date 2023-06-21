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
      default: 'default'
    }
  },
  mounted() {
    const term = new Terminal()
    term.open(this.$refs.terminal)
    term.write(this.hostname)
  }
}
</script>
