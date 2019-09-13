/* eslint-disable no-param-reassign */

const state = {
  appName: 'Ratteb',
  appVersion: '1.0.0',
  appBuild: '1000',

  pageTitle: 'Welcome',
  actions: [],

  contentState: 0,
  sidebarOpened: true,
};

const getters = {
  getAppName: s => s.appName,
  getAppVersion: s => s.appVersion,
  getAppBuild: s => s.appBuild,
  getPageTitle: s => s.pageTitle,
};

const actions = {

  setPageTitle(s, title) {
    s.title = title;
  },
};

const mutations = {
  toggleSidebar() {
    state.sidebarOpened = !state.sidebarOpened;

    if (state.sidebarOpened) {
      localStorage.set('sidebarStatus', 1)
    } else {
      localStorage.set('sidebarStatus', 0)
    }
  },
}

export default { state, actions, mutations, getters };
