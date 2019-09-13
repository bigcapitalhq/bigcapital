<template>
  <div>
    <el-table v-loading="isLoading" :data="items.list" border fit highlight-current-row>

    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'items-categories',
  data() {
    return {
      current_state: 0,
    };
  },
  computed: {
    ...mapGetters({
      categories: 'getItemsCategories',
    }),
  },
  methods: {
    ...mapActions(['fetchItemsCategories']),

    /**
     * Handle the reload data of the current view.
     */
    async reloadData() {
      await this.fetchData();
    },

    /**
     * Handle the fetch data of the datatable.
     */
    async fetchData() {
      await this.fetchItemsCategories();
    },
  },
};
</script>
