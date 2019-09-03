<template>

</template>
<script>

const STATE = {
  LOADING: 1,
  EMPTY_LIST: 2,
  NO_SEARCH_RESULTS: 3,
};

export default {
  name: 'customers-list',
  data() {
    return {
      current_state: 0,
    };
  },
  computed: {
    loading() {
      return this.current_state === STATE.LOADING;
    },
    emptyList() {
      return this.current_state === STATE.EMPTY_LIST;
    },
    noSearchResults() {
      return this.current_state === STATE.NO_SEARCH_RESULTS;
    },
  },
}
</script>
