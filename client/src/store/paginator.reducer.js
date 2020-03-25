const pages = (pages, action) => {
  const { type, items, meta } = action;

  switch(type) {
    case REQUEST_PAGE: 
      return {
        ...pages,
        [meta.currentPage]: {
          ...pages[meta.currentPage],
          ids: [],
          fetching: true,
        },
      };
    case RECEIVE_PAGE: 
      return {
        ...pages,
        [meta.currentPage]: {
          ...pages[meta.currentPage],
          ids: items.map(i => i.id),
          fetching: false,
        },
      };
  }
};



