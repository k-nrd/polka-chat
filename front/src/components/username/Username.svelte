<script>
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher()

  let name = ''

  const pickName = () => {
    if (name === '') return
    dispatch('name', { value: name })
  }

  const handleKeydown = (event) => {
    if (event.key === 'Enter') {
      pickName()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="username-container">
  <small>Pick your username:</small>
  <div class="username">
    <input type="text" bind:value={name}/>
    <button type="button" on:click={pickName}>Ok</button>
  </div>
</div>

<style>
  .username-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0.75rem;
  }

  small {
    width: 80%;
    height: 20px;
    text-align: left;
  }

  .username {
    width: 80%;
    height: 6.5%;
    position: relative;
  }

  input {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid lightgray;
  }

  button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5rem 1.5rem;
    border: 1px solid lightgray;
    background-color: white;
    border-radius: 4px;
    color: black;
  }
</style>
