<template>
  <div id="dashboard" class="dashboard">
    <DashboardSidebar />

    <div class="dashboard__content">
      <DashboardTopbar></DashboardTopbar>

      <div class="dashboard__content-inner">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardSidebar from '@/views/Sidebar';
import DashboardTopbar from '@/views/Topbar';

export default {
  name: 'dashboard',
  components: {
    DashboardTopbar,
    DashboardSidebar,
  },
};
</script>

<style lang="scss">
#dashboard{
  display: flex;
  flex-direction: row;
}
</style>
