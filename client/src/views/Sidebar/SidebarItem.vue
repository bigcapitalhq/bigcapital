<template>
  <div class="sidebar__menu-item" :class="computedClasses">
    <router-link class="sidebar__menu-item-anchor" :to="{name: to}">
      <span class="title">{{ name }}</span>
      <span v-if="count" class="count">{{ count }}</span>
    </router-link>

    <div v-if="hasChildren" class="sidebar__menu-item-children">
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
    count: [Number, Boolean],
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
