import View from './view';
import { getDuration, getFilmYear} from '../utils.js';

const createFilmCardTemplate = (film) => {
  const { id, comments, filmInfo, userDetails } = film;

  const watchlistClassName = userDetails.watchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-card__controls-item--active'
    : '';

  return (
    `<article class="film-card" data-id='${id}'>
        <h3 class="film-card__title">${filmInfo.title}</h3>
        <p class="film-card__rating">${filmInfo.totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getFilmYear(filmInfo.release.date)}</span>
          <span class="film-card__duration">${getDuration(filmInfo.runtime)}</span>
          <span class="film-card__genre">0</span>
        </p>
        <img src="./images/posters/${filmInfo.poster}" alt="${filmInfo.title}" class="film-card__poster">
        <p class="film-card__description">${filmInfo.description.length > 140 ? `${filmInfo.description.slice(0, 139)}...` : filmInfo.description}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}">Mark as favorite</button>
        </form>
      </article>`
  );
};

export default class FilmCardView extends View {
  constructor(film) {
    super();
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
  }
}
