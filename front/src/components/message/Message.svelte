<script>
  export let type
  export let text

  $: ours = type === 'ours'
  $: notification = type === 'notification'
  $: theirs = type === 'theirs'
</script>

<div class="message-container" class:ours class:theirs class:notification>
  <div class="message" class:ours class:theirs class:notification>{ text }</div>
  {#if !notification}
    <div class="arrow" class:ours class:theirs></div>
  {/if}
</div>

<style>
  .message-container {
    width: 100%;
    height: 80px;
    padding: 0.75rem;
  }

  .message-container.notification {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .message-container.ours {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }

  .message-container.theirs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .message {
    height: 100%;
    border-radius: 4px;
  }

  .arrow {
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }

  .arrow.ours {
    margin-left: auto;
    margin-right: 10px;
    border-top: 5px solid darkslategray;
  }

  .arrow.theirs {
    margin-right: auto;
    margin-left: 10px;
    border-top: 5px solid darkslategray;
  }

  .message.ours {
    background-color: darkslategray;
    color: white;
    display: flex;
    justify-content: flex-end;
    padding: 0.75rem;
    align-items: center;
  }

  .message.notification {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    color: black;
  }

  .message.theirs {
    background-color: darkslateblue;
    color: white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0.75rem;
  }
</style>
