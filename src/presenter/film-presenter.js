import {render, remove, replace, RenderPosition} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailView from '../view/film-detail-view.js';
import {IS_PRESSED_ESCAPE_KEY} from '../const.js';


export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;

  #filmCardComponent = null;

  #film = null;
  #filmPopup = null;
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

    this.#filmCardComponent.setClickHandler(this.#handleCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

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
  };

  #showFilmDetail = () => {
    const footerElement = document.querySelector('.footer');
    const filmComments = this.#comments.filter(({id}) => this.#film.comments.some((commentId) => commentId === Number(id)));

    this.#filmPopup = new FilmDetailView(this.#film, filmComments);

    this.#filmPopup.setClickHandler(this.#hideFilmDetail);
    this.#filmPopup.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopup.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopup.setFavoriteClickHandler(this.#handleFavoriteClick);

    render(this.#filmPopup, footerElement, RenderPosition.AFTEREND);
    document.body.addEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.add('hide-overflow');
  };

  #hideFilmDetail = () => {
    document.body.classList.remove('hide-overflow');
    document.body.removeEventListener('keydown', this.#escKeyDownHandler);
    if (document.querySelector('.film-details')) {
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
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  };

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  };
}
