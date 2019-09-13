const state = {
  logs: [],
};

const mutations = {
  ADD_ERROR_LOG: (s, log) => {
    s.logs.push(log);
  },
  CLEAR_ERROR_LOG: (s) => {
    s.logs.splice(0);
  }
}

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log);
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG');
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
