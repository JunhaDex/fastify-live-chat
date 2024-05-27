<template>
  <main>
    <div class="text-3xl font-bold underline">foo</div>
    <button @click="sendMessage">Send Message</button>
  </main>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

const socketUrl = 'http://localhost:3000/receive'
let ws: WebSocket
onMounted(() => {
  console.log('mounted')
  ws = new WebSocket(socketUrl)
  ws.onopen = () => {
    console.log('connected')
  }
  ws.onmessage = (event) => {
    console.log('received message')
    console.log(event.data)
  }

  ws.onclose = () => {
    console.log('disconnected')
  }

  ws.onerror = (error) => {
    console.log('error!')
    console.log(error)
  }
})

function sendMessage() {
  if (ws) {
    console.log('sending message')
    ws.send(JSON.stringify({ id: 'foo', msg: 'bar' }))
  }
}
</script>
<style scoped></style>
