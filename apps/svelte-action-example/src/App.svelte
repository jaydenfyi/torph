<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { textMorph } from 'torph/svelte';

  const texts = [
    "Animate Text Easily",
    "Animate Text Effortlessly",
    "Animate Text Seamlessly",
    "Fluidly Animate Text",
  ];

  let index = 0;
  let interval: ReturnType<typeof setInterval>;
  let text = texts[index];
  let morphParams = {
    text,
    duration: 400,
    ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
  };

  onMount(() => {
    interval = setInterval(() => {
      index = (index + 1) % texts.length;
    }, 2000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  $: text = texts[index];
  $: morphParams = {
    text,
    duration: 400,
    ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
  };
</script>

<div class="container">
  <h1 use:textMorph={morphParams}></h1>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 2rem;
  }

  h1 {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
    line-height: 1.2;
  }
</style>
