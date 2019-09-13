
const state = {
  items: [
    {
      name: 'Home',
      to: 'dashboard.home',
      icon: 'home',
      count: null,
    },
    {
      name: 'Products',
      to: 'dashboard.items.list',
    },
    {
      name: 'Customers',
      to: 'dashboard.home',
    },
    {
      name: 'Suppliers',
      to: 'dashboard.home',
    },
    {
      name: 'Reports',
      to: 'dashboard.home',
    },
    {
      name: 'Users',
      to: 'dashboard.users.list',
      children: {
        name: 'New User',
        to: 'dashboard.user.new',
      },
    },
    {
      name: 'Accounting',
      to: 'dashboard.accounts.list',
    },
  ],

  quickActions: [
    {
      route: 'dashboard.items.list',
      actions: [
        {
          dialog: 'global-search',
          label: 'Search',
          icon: 'search',
        },
      ],
    },
    {
      route: 'dashboard.items.list',
      actions: [
        {
          dialog: 'test',
        },
      ],
    },
  ],
};

const getters = {
  getSidebarItems: s => s.items,
  getSidebarItem: s => name => s.items.find(item => item.name === name),

  getAllQuickActions: s => s.quickActions,
  getQuickActions: s => (route) => {
    const foundDefault = s.quickActions.find(q => q.default === true);
    const found = s.quickActions.find(q => q.route === route);
    const defaultActions = foundDefault ? foundDefault.actions : [];

    return found ? [...defaultActions, found.actions] : defaultActions;
  },
};

const actions = {

  /**
   * Set count to the given sidebar item.
   */
  setSidebarItemCount(s, { name, count }) {
    s.items = s.items.map((item) => {
      const mapped = { ...item };

      if (item.name === name) {
        mapped.count = count;
      }
      return mapped;
    });
  },
};

export default { state, getters, actions };
