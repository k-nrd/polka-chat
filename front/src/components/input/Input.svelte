<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  let msg = ''
  
  const sendMsg = () => {
    dispatch('send', { value: msg })
    msg = ''
  }
  
  const handleKeydown = (event) => {
    if (event.key === 'Enter') {
      sendMsg()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="input-container">
  <input type="text" bind:value={msg}/>
  <button type="button" on:click={sendMsg}>Send</button>
</div>

<style>
  .input-container {
    width: 100%;
    height: 46px;
    padding: 0 0.75rem 0.75rem 0.75rem;
    position: relative;
  }

  input {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid lightgray;
    padding-left: 0.75rem;
  }

  button {
    position: absolute;
    top: 0;
    right: 0.75rem;
    padding: 0.5rem 1.5rem;
    border: 1px solid lightgray;
    border-radius: 4px;
    background-color: #f1f1f1;
    color: black;
  }
</style>
