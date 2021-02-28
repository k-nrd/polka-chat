<script>
  import { createEventDispatcher } from 'svelte'

  export let active = ''

  const dispatch = createEventDispatcher()

  const tabs = [
    {
      id: 'TEST', name: 'Test'
    },
    {
      id: 'TEST2', name: 'Test 2'
    }
  ]
</script>

<ul>
  {#each tabs as { id, name }}
    <li on:click={() => active !== name ? dispatch('tab', { value: id }) : {}} class:active={active === id}>{name}</li>
  {/each}
</ul>

<style>
  ul {
    display: flex;
    height: 40px;
    margin-top: 0.75rem;
    border-bottom: 1px solid lightgray;
  }

  li {
    cursor: pointer;
    display: flex;
    padding: 10px 2rem;
    justify-content: center;
    align-items: center;
    border-top: 1px solid lightgray;
    border-left: 1px solid lightgray;
    background-color: #f1f1f1;
  }

  li:first-child {
    border-top-left-radius: 4px;
    margin-left: 0.75rem;
  }

  li:last-child {
    border-right: 1px solid lightgray;
    border-top-right-radius: 4px;
  }

  li.active {
    background-color: white;
  }
</style>
