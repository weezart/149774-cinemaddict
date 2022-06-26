import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import {SHAKE_CLASS_NAME, SHAKE_ANIMATION_TIMEOUT} from '../const.js';
import {getDuration, humanizeDate} from '../utils/film.js';

const createFilmDetailTemplate = (film) => {
  const { id, filmInfo, userDetails } = film;

  const watchlistClassName = userDetails.watchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-details__control-button--active'
    : '';

  return (
    `<section class="film-details" data-id="${id}">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeDate(filmInfo.release.date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getDuration(filmInfo.runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${filmInfo.genre.map((it) => `<span class="film-details__genre">${it}</span>`).join('\n')}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist" ${film.isDisabled ? 'disabled' : ''}>Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched" ${film.isDisabled ? 'disabled' : ''}>Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite" ${film.isDisabled ? 'disabled' : ''}>Add to favorites</button>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailView extends AbstractStatefulView {
  constructor(film) {
    super();

    this._state = FilmDetailView.parseFilmToState(film);
  }

  static parseFilmToState = (film) => ({
    ...film,
    scrollTop: null,
    isDisabled: false,
  });

  get template() {
    return createFilmDetailTemplate(this._state);
  }

  get controls() {
    return this.element.querySelector('.film-details__top-container');
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  _restoreHandlers = () => {
    this.setClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.element.scrollTop = this._state.scrollTop;
  };

  resetFormState = () => {
    this.element.querySelector('.film-details__control-button[disabled]').disabled = false
  };

  shakeControls(callback) {
    this.controls.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      this.controls.classList.remove(SHAKE_CLASS_NAME);
      callback?.();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.favoriteClick();
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
