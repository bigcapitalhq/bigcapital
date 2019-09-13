import Vue from 'vue';

export default Vue.extend({
  name: 'reloadable',
  created() {
    this.$eventBus.$on('reload-data', this.onReloadData);
  },
  methods: {
    async onReloadData() {
      this.$nprogress.start();
      await this.reloadData();
      this.$nprogress.done();
    },

    reloadData() {},
  },
  beforeDestroy() {
    this.$eventBus.$off('reload-data', this.onReloadData);
  },
});