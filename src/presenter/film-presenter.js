import {render, remove, replace, RenderPosition} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailView from '../view/film-detail-view.js';
import {UserAction, UpdateType, IS_PRESSED_ESCAPE_KEY} from '../const.js';


export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;

  #filmCardComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #comments = null;

  constructor(filmListContainer, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmDetailView(this.#film, this.#comments);

    this.#filmCardComponent.setClickHandler(this.#handleCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#filmPopupComponent.setClickHandler(this.#hideFilmDetail);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  };

  #showFilmDetail = () => {
    const footerElement = document.querySelector('.footer');

    render(this.#filmPopupComponent, footerElement, RenderPosition.AFTEREND);
    document.body.addEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.add('hide-overflow');
  };

  #hideFilmDetail = () => {
    document.body.classList.remove('hide-overflow');
    document.body.removeEventListener('keydown', this.#escKeyDownHandler);
    if (document.querySelector('.film-details')) {
      this.#filmPopupComponent.reset(this.#film);
      document.querySelector('.film-details').remove();
    }
  };

  #escKeyDownHandler = (evt) => {
    if (IS_PRESSED_ESCAPE_KEY(evt)) {
      evt.preventDefault();
      this.#hideFilmDetail();
    }
  };

  #handleCardClick = () => {
    if (document.body.classList.contains('hide-overflow')) {
      this.#hideFilmDetail();
    }

    this.#showFilmDetail();
  };

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}}
    );
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}}
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}}
    );
  };
}
