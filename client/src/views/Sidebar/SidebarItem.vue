<template>
  <div class="sidebar__item" :class="computedClasses">
    <router-link :to="to">
      <span class="title">{{ name }}</span>
      <span v-if="count" class="count">{{ count }}</span>
    </router-link>

    <div v-if="hasChildren" class="sidebar__item-children">
    </div>
  </div>
</template>

<script>
export default {
  name: 'sidebar-item',
  props: {
    name: String,
    to: String,
    icon: String,
    children: Array,
  },
  computed: {
    computedClasses() {
      return {
        [`sidebar__item--${this.name}`]: this.name,
      };
    },
  },
  methods: {
    hasChildren() {
      return this.children.length > 0;
    },
  },
};
</script>
