export const Config = {
  oneClickDemo: {
    enable: process.env.REACT_APP_ONE_CLICK_DEMO_ENABLE === 'true',
    demoUrl: process.env.REACT_APP_DEMO_ACCOUNT_URL || '',
  },
};
