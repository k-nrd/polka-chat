<script>
  import { beforeUpdate, afterUpdate } from 'svelte'
  import { Message } from '../message'
  
  export let messages = []
  
  let feed
  let autoscroll

  beforeUpdate(() => {
    autoscroll = feed && (feed.offsetHeight + feed.scrollTop) > (feed.scrollHeight - 20)
  })

  afterUpdate(() => {
    if (autoscroll) feed.scrollTo(0, feed.scrollHeight)
  })
</script>

<div class="feed-container">
  <div class="feed" bind:this={feed}>
    {#each messages as message}
      <Message {...message} />
    {/each}
  </div>
</div>

<style>
  .feed-container {
    display: flex;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    padding: 0.75rem;
    overflow-y: hidden;
  }

  .feed {
    height: 100%;
    width: 100%;
    border-radius: 4px;
    border: 1px solid lightgray;
    overflow-y: auto;
  }
</style>
