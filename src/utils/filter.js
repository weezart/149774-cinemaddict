import {FilterType} from '../const.js';

const filter = {
  [FilterType.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter(({userDetails}) => userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter(({userDetails}) => userDetails.favorite)
};

export {filter};
