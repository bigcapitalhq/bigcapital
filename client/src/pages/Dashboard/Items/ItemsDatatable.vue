
<template>
  <el-table v-loading="isLoading" :data="items.list" border fit highlight-current-row>

  </el-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Reloadable from '@/mixins/Reloadable';

const STATE = {
  LOADING: 1,
};
export default {
  name: 'items-datatable',
  mixins: [Reloadable],
  data() {
    return {
      current_state: 0,
      page: 1,
    };
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
    }),
    isLoading() {
      return this.current_state === STATE.LOADING;
    },
  },
  created() {
    this.current_state = STATE.LOADING;
    this.fetchData();
    this.current_state = 0;
  },
  methods: {
    ...mapActions(['fetchItems']),

    /**
     * Handle the reload data.
     */
    reloadData() {
      this.fetchData();
    },

    /**
     * Handle the fetch data of datatable.
     */
    async fetchData() {
      await this.fetchItems({ page: this.page });
    },
  },
};
</script>
