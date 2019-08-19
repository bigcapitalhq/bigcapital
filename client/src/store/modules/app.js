/* eslint-disable no-param-reassign */

const state = {
  appName: 'Ratteb',
  appVersion: '1.0.0',
  appBuild: '1000',

  pageTitle: 'Welcome',
  actions: [],
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

export default { state, actions, getters };
