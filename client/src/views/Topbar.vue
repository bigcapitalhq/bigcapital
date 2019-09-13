<template>
  <div class="topbar">
    <div class="topbar__sidebar-toggle">

    </div>

    <div class="topbar__title">
      <h3>{{ pageTitle }}</h3>
    </div>

    <div class="topbar__actions">
      <div class="topbar__actions-list">
        <div v-for="(action, index) in actions" :key="index">
          <button @click.prevent="onClickItem(action)">{{ action.label }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'dashboard-topbar',
  computed: {
    ...mapGetters({
      pageTitle: 'getPageTitle',
      quickActions: 'getQuickActions',
    }),
    actions() {
      return this.quickActions(this.$route.name) || [];
    },
  },
  methods: {

    onClickItem(action) {
      return action;
    },
  }
};
</script>

<style lang="scss">
.topbar{
  padding-bottom: 12px;
  width: 100%;

  &__title{

    h3{
      margin: 0;
      font-size: 30px;
    }
  }

  &__actions{

  }
}
</style>
