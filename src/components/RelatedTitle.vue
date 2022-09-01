<template>
  <h2 class="h5 text-danger">
    {{ title }} <small>({{ length }})</small>
  </h2>
</template>

<script>
export default {
  name: "RelatedTitle",
  props: {
    length: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: "Loading"
    },
  },
};
</script>

<style>
</style>