import {FilterType} from '../const.js';

export const filterFilms = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter(({userDetails}) => userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter(({userDetails}) => userDetails.favorite)
};
