<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="User" name="first" :lazy="true">User</el-tab-pane>
      <el-tab-pane label="Config" name="second" :lazy="true">Config</el-tab-pane>
      <el-tab-pane label="Role" name="third" :lazy="true">Role</el-tab-pane>
      <el-tab-pane label="Task" name="fourth" :lazy="true">Task</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>

export default {
  name: 'products-list',
  data() {
    return {
      activeName: 'first',
    };
  },
  methods: {
    handleClick(tab, event) {

    },
  },
};
</script>
