<template>
  <div>Users List</div>
</template>

<script>
export default {
  name: 'users-list',
  afterRouteEnter(to, from, next) {
    debugger;
    this.$store.commit('setPageTitle', this.$t('users_list'));
    next();
  },
}
</script>
