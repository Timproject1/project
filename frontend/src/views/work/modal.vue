<script setup>
const emit = defineEmits(["close"]);
const emitClose = () => {
  emit("close");
};
</script>
<template>
  <div class="Model">
    <slot name="content" />
    <slot name="actions" :close="emitClose" />
  </div>
</template>
<style scoped>
.Model {
  background-color: beige;
}
</style>
