<template>
  <div class="card h-100 shadow-sm">
    <img :src="image" class="card-img-top" :alt="title" />
    <div class="card-body">
      <span class="card-title fw-bold" :title="title">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Related",
  props: {
    image: {
      type: String,
    },
    title: {
      type: String,
    },
  },
};
</script>

<style>
</style>