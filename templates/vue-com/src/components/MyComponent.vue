<script setup lang="ts">
const props = defineProps<{ name?: string }>()
const name = props.name || ref<string>('MyComponent')
</script>

<template>
  <div>
    Hello, this is {{ name }}
  </div>
</template>
