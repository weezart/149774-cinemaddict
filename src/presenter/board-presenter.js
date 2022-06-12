import {render, remove} from '../framework/render.js';
import {SortType, FilterType, UpdateType, UserAction, FILM_COUNT_PER_STEP, EXTRA_FILM_COUNT} from '../const.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';
import FilmsContainer from '../view/films-container-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoFilmsView from '../view/no-films-view';
import FilmPresenter from './film-presenter.js';


export default class BoardPresenter {
  #boardContainer = null;
  #pageBodyElement = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #noFilmComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #openFilmPresenter = null;
  #pagePosition = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #filmPresenter = new Map();

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsContainerComponent = new FilmsContainer();
  #filmsContainerTopRatedComponent = new FilmsContainer();
  #filmsContainerMostCommentedComponent = new FilmsContainer();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(boardContainer, pageBodyElement, filmsModel, commentsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#pageBodyElement = pageBodyElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...filteredFilms].sort(sortFilmsByDate);
      case SortType.RATING:
        return [...filteredFilms].sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  get topRatedFilms () {
    return [...this.#filmsModel.films]
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, Math.min(this.films.length, EXTRA_FILM_COUNT));
  }

  get mostCommentedFilms () {
    return [...this.#filmsModel.films]
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, Math.min(this.films.length, EXTRA_FILM_COUNT));
  }

  init = () => {
    this.#renderBoard();
  };

  #handleLoadMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmsCount);

    this.#renderFilms(films, this.#filmsContainerComponent.element);
    this.#renderedFilmCount = newRenderedFilmsCount;

    if (this.#renderedFilmCount >= filmsCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      // case UserAction.ADD_COMMENT:
      //   this.#filmsModel.addFilm(updateType, update);
      //   break;
      // case UserAction.DELETE_COMMENT:
      //   this.#filmsModel.deleteFilm(updateType, update);
      //   break;
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter
      .forEach((value) => value
        .forEach((presenter) => presenter.resetView()));
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#pageBodyElement, this.#handleViewAction, this.#handleModeChange);

    filmPresenter.init(film, this.#getFilmComments(film));

    if (this.#filmPresenter.has(film.id)) {
      this.#filmPresenter.get(film.id).push(filmPresenter);
      return;
    }
    this.#filmPresenter.set(film.id, [filmPresenter]);
  };

  #getFilmComments = (film) => this.comments.filter(({id}) => film.comments.some((commentId) => commentId === Number(id)));

  #renderFilms = (films, container) => {
    films.forEach((film) => this.#renderFilm(film, container));
  };


  #clearBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;
    this.#pagePosition = document.documentElement.scrollTop;

    this.#filmPresenter
      .forEach((presenters) =>
        presenters.forEach((presenter) => {
          if (presenter.isOpen()) {
            this.#openFilmPresenter = presenter;
            return presenter.partialDestroy();
          }
          presenter.destroy();
        })
      );
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }
    remove(this.#loadMoreButtonComponent);
    remove(this.#filmsListMostCommentedComponent);
    remove(this.#filmsContainerMostCommentedComponent);
    remove(this.#filmsListTopRatedComponent);
    remove(this.#filmsContainerTopRatedComponent);


    if (resetRenderedFilmsCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmsCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderMostCommentedList = () => {
    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(this.#filmsContainerMostCommentedComponent, this.#filmsListMostCommentedComponent.element);

    this.mostCommentedFilms.forEach((film) => this.#renderFilm(film, this.#filmsContainerMostCommentedComponent.element));
  };

  #renderTopRatedList = () => {
    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsContainerTopRatedComponent, this.#filmsListTopRatedComponent.element);

    this.topRatedFilms.forEach((film) => this.#renderFilm(film, this.#filmsContainerTopRatedComponent.element));
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmsView(this.#filterType);
    render(this.#noFilmComponent, this.#filmsComponent.element);
  };

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);

    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#boardContainer);
  };

  #updateOpenFilmPresenter = () => {
    if (!this.#openFilmPresenter) {
      return true;
    }

    if (!this.#openFilmPresenter.isOpen) {
      this.#openFilmPresenter = null;
    }

    const updateFilm = this.#filmsModel.films.filter((film) => film.id === this.#openFilmPresenter.film.id)[0];
    this.#openFilmPresenter.init(updateFilm, this.#getFilmComments(this.#openFilmPresenter.film));
  };

  #renderBoard = () => {
    const films = this.films;
    const filmsCount = films.length;

    if (filmsCount !== 0) {
      this.#renderSort();
    }

    render(this.#filmsComponent, this.#boardContainer);

    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

    this.#updateOpenFilmPresenter();

    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)), this.#filmsContainerComponent.element);

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }

    this.#renderMostCommentedList();
    this.#renderTopRatedList();

    if (this.#pagePosition) {
      window.scrollTo(0, this.#pagePosition);
    }
  };
}
