import {render, remove, replace} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailView from '../view/film-detail-view.js';
import CommentPresenter from './comment-presenter.js';
import {UserAction, UpdateType, Mode, IS_PRESSED_ESCAPE_KEY} from '../const.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #pageBodyElement = null;
  #commentModel = null;
  #changeData = null;

  #filmCardComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #commentPresenter = null;
  #mode = Mode.DEFAULT;
  #scrollTopPopup = null;

  constructor(filmListContainer, pageBodyElement, commentModel, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#pageBodyElement = pageBodyElement;
    this.#commentModel = commentModel;
    this.#changeData = changeData;
  }

  get film() {
    return this.#film;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevPopupComponent =  this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmDetailView(this.#film);
    this.#commentPresenter = new CommentPresenter(this.#filmPopupComponent.element, film, this.#commentModel, this.#changeData);
    this.#commentPresenter.init(film);
    this.#filmCardComponent.setClickHandler(this.#handleCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#filmPopupComponent.setClickHandler(this.#hideFilmDetail);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null && prevPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);

    if (this.#mode === Mode.OPENED) {
      this.#scrollTopPopup = prevPopupComponent.element.scrollTop;
      replace(this.#filmPopupComponent, prevPopupComponent);
      this.#filmPopupComponent.element.scrollTop = this.#scrollTopPopup;
      remove(prevPopupComponent);
    }
  };


  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  };

  partialDestroy = () => {
    remove(this.#filmCardComponent);
  };

  #showFilmDetail = () => {
    if (this.#mode === Mode.DEFAULT) {
      render(this.#filmPopupComponent, this.#pageBodyElement);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      this.#mode = Mode.OPENED;
      this.#pageBodyElement.classList.add('hide-overflow');
    }
  };

  #hideFilmDetail = () => {
    this.#mode = Mode.DEFAULT;
    this.#commentPresenter.reset(this.#film);
    this.#filmPopupComponent.element.remove();
    this.#pageBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
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

  #handleWatchlistClick = async () => {
    await this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}}
    );
  };

  #handleWatchedClick = async () => {
    await this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}}
    );
  };

  #handleFavoriteClick = async () => {
    await this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}}
    );
  };

  setAdding = () => {
    this.#commentPresenter.setAdding();
  };

  setDeleting = (commentId) => {
    this.#commentPresenter.setDeleting(commentId);
  };

  setAborting = () => {
    if (this.isOpen()) {
      this.#commentPresenter.setAborting();
      this.#filmPopupComponent.updateElement({
        isDisabled: false,
      });
    } else {
      this.#filmCardComponent.shake(this.resetFormState);
    }
  };

  resetFormState = () => {
    this.#filmCardComponent.updateElement({
      isDisabled: false,
    });
  };

  isOpen = () => this.#mode === Mode.OPENED;
}
