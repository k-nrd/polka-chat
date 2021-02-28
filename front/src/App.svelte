<script lang="ts">
  import { Tabs } from './components/tabs'
  import { Feed } from './components/feed'
  import { Input } from './components/input'
  import { Username } from './components/username'

  let username
  let active = ''
  let messages = []

  const socket = new WebSocket(`ws://${window.location.hostname}:3000`)

  const send = (json: object) => {
    if (socket.readyState <= 1) socket.send(JSON.stringify(json))
  }

  const setUsername = ({ detail: { value } }) => {
    username = value
  }

  const enterChannel = ({ detail: { value } }) => {
    active = value
    messages = [{ type: 'notification', text: `User ${username} joined the channel.` }]
    send({ channel: value, event: 'addUser', data: username })
  }

  const sendMessage = ({ detail: { value } }) => {
    messages = messages.concat({ type: 'ours', text: value })
    send({ channel: active, event: 'newMsg', data: value })
  }

  const messageHandler = ({ data: json }) => {
    const { channel, event, data } = JSON.parse(json)
    if (event === 'userJoined' && channel === active) {
      messages = messages.concat({ type: 'notification', text: `User ${data} joined the channel` })
    } else if (event === 'newMsg' && channel === active) {
      messages = messages.concat({ type: 'theirs', text: data })
    }
    console.log(`Received data. Channel: ${channel}, event: ${event}, data: ${data}`)
  }

  socket.addEventListener('open', console.log)
  socket.addEventListener('message', messageHandler)
</script>

<main>
  <div class="chat">
    {#if !username}
      <Username on:name={setUsername} />
    {:else}
      <Tabs {active} on:tab={enterChannel}/>
      {#if active}
        <Feed {messages} />
        <Input on:send={sendMessage} />
      {/if}
    {/if}
  </div>
</main>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(html), :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    width: 100%;
    height: 100%;
  }

	main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #f1f1f1;
	}

  .chat {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 4px;
    min-height: 600px;
    min-width: 600px;
    height: 75vmin;
    width: 75vmin;
  }
</style>
