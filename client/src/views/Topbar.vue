<template>
  <div class="topbar">
    <div class="topbar__title">
      <h3>{{ pageTitle }}</h3>
    </div>

    <div class="topbar__actions">

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
    }),
  },
};
</script>

<style lang="scss">
.topbar{
  padding-bottom: 12px;

  &__title{

    h3{
      font-size: 30px;
    }
  }

  &__actions{

  }
}
</style>
