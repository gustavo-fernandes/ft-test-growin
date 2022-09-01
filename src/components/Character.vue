<template>
  <router-link :to="`/character/${id}`" :title="name">{{ name }}</router-link>
</template>

<script>
export default {
  name: "Character",
  props: {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
  },
};
</script>

<style scoped>
.card-text {
  font-size: 0.9rem;
}
</style>