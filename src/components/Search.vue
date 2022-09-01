<template>
  <div class="d-flex p-3 bg-light">
    <input
      class="form-control form-control-lg"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search character..."
    />
  </div>
</template>

<script>
export default {
  props: ["modelValue"],
};
</script>

<style>
</style>