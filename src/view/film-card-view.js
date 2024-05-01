import { getDuration, getFilmYear} from '../utils/film.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

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
    `<article class="film-card" data-id="${id}">
      <a class="film-card__link">
        <h3 class="film-card__title">${filmInfo.title}</h3>
        <p class="film-card__rating">${filmInfo.totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getFilmYear(filmInfo.release.date)}</span>
          <span class="film-card__duration">${getDuration(filmInfo.duration)}</span>
          <span class="film-card__genre">${filmInfo.genre[0]}</span>
        </p>
        <img src="${filmInfo.poster}" alt="${filmInfo.title}" class="film-card__poster">
        <p class="film-card__description">${filmInfo.description.length > 140 ? `${filmInfo.description.slice(0, 139)}...` : filmInfo.description}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}" ${film.isDisabled ? 'disabled' : ''}>Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" ${film.isDisabled ? 'disabled' : ''}>Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" ${film.isDisabled ? 'disabled' : ''}>Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCardView extends AbstractStatefulView {
  constructor(film) {
    super();

    this._state = FilmCardView.parseFilmToState(film);
  }

  static parseFilmToState = (film) => ({
    ...film,
    isDisabled: false,
  });

  get template() {
    return createFilmCardTemplate(this._state);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  _restoreHandlers = () => {
    this.setClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.favoriteClick();
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
