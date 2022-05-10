<script setup lang="ts">
defineProps<{ msg: string }>()

const count = $ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    See
    <code>README.md</code> for more information.
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Docs</a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <button type="button" @click="count++">
    count is: {{ count }}
  </button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
h1 {
  @apply text-3xl font-bold;
}

p {
  @apply my-2;
}

a {
  @apply text-[#42b983];
}

code {
  @apply text-[#304455] bg-[#eee] px-1 py-0.5 rounded;
}

button {
  @apply text-(light-200 base) bg-[#42b983] hover:bg-[#79B592] w-24 h-8 rounded;
}
</style>
