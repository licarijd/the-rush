module.exports = {
  TIME_ONE_MINUTE: 1 * 60 * 1000,
  VALID_SORT_KEYS: new Set(['Yds', 'Lng', 'TD', 'Avg']),
  SORT_ORDER: {
    ASC: 'ASC',
    DESC: 'DESC'
  },
  filterOptions: {
    name: 'Player',
    team: 'Team'
  },
  API_STATUS: {
    INVALID_SORT_KEY: 'Invalid sort key',
    INVALID_PAGE: 'Invalid page - page must be a number',
    INVALID_PAGE_SIZE: 'Invalid pageSize - pageSize must be a number',
    MISSING_PAGE_SIZE: 'You must provide a pageSize when you request a page',
    INVALID_ORDER: 'The order can only be ascending (ASC) or descending (DESC)'
  }
};
