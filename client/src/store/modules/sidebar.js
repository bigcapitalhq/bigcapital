
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
      to: 'dashboard.home',
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
  ],
};

const getters = {
  getSidebarItems: s => s.items,
  getSidebarItem: s => name => s.items.find(item => item.name === name),
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
