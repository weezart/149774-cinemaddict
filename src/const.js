export const COMMENT_EMOTIONS = ['angry', 'puke', 'sleeping', 'smile'];

export const IS_PRESSED_ESCAPE_KEY = (evt) => evt.key === 'Escape';

export const FILM_COUNT_PER_STEP = 5;

export const EXTRA_FILM_COUNT = 2;

export const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_POPUP: 'UPDATE_POPUP',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
