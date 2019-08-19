<template>
  <div class="dashboard__sidebar sidebar">

    <div class="sidebar__app">
      <div class="sidebar__app-logo">

      </div>

      <div class="sidebar__app-info">
        <h6 class="title">{{ appName }}</h6>
        <span class="version">{{ appVersion }} (build {{ appBuild }})</span>
      </div>
    </div>

    <div class="sidebar__menu">
      <SidebarItem
        v-for="(item, index) in sidebarItems" :key="index"
        :to="item.to"
        :name="item.name"
        :count="item.count"
        :children="item.children"
      />
    </div>
  </div>
</template>

<script>
import SidebarItem from '@/views/Sidebar/SidebarItem';
import { mapGetters } from 'vuex';

export default {
  name: 'sidebar',
  components: {
    SidebarItem,
  },
  computed: {
    ...mapGetters({
      appName: 'getAppName',
      appVersion: 'getAppVersion',
      appBuild: 'getAppBuild',
      sidebarItems: 'getSidebarItems',
    }),
  },
};
</script>

<style>
.dashboard__sidebar{
  width: 210px;
  background: red;
  transition: width 0.3s;
  height: 100%;
}
</style>
