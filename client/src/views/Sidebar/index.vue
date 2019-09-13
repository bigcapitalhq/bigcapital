<template>
  <div class="dashboard__sidebar sidebar">

    <div class="sidebar__app">
      <div class="sidebar__app-logo">
        <span class="logo"></span>
      </div>

      <div class="sidebar__app-info">
        <h6 class="title">{{ appName }}</h6>
        <span class="version">{{ appVersion }} (build {{ appBuild }})</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="sidebar__menu">
      <SidebarItem
        v-for="(item, index) in sidebarItems" :key="index"
        :to="item.to"
        :name="item.name"
        :count="item.count || false"
        :children="item.children"
      />
    </div>

    <div class="sidebar__user">
      <div class="sidebar__user-avatar">
        <span class="logo"></span>
      </div>

      <div class="sidebar__user-info">
        <h6 class="title">Ahmed Bouhuolia</h6>
        <span class="info">a.bouhuolia@gmail.com</span>
      </div>
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

<style lang="scss">
.sidebar{
  width: 210px;
  min-width: 210px;
  background: #01092d;
  transition: width 0.3s;
  height: 100%;
  color: #fff;
  min-height: 100vh;

  // App info
  // -------------
  &__app{
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    &-logo{

      .logo {
        height: 35px;
        width: 35px;
        border-radius: 35px;
        background: red;
      }
    }

    &-info{

      .title{
        margin: 0;
      }

      .version{
        margin: 0;
      }
    }
  }

  // Menu List
  // -------------
  &__menu{

  }

  &__menu-item{

    &-anchor{
      color: #fff;
    }
  }

  // User info.
  // -------------
  &__user{
    border-top: 1px solid red;

    &-info{

      .title{
        margin: 0;
      }

      .info{
        font-size: 12px;
      }
    }
  }
}
</style>
