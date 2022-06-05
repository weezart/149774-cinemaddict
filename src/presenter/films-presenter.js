import {render, remove} from '../framework/render.js';
import {FILM_COUNT_PER_STEP, EXTRA_FILM_COUNT} from '../const.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';
import FilmsContainer from '../view/films-container-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoFilmsView from '../view/no-films-view';
import FilmPresenter from './film-presenter.js';


export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #topRatedPresenter = new Map();
  #mostCommentedPresenter = new Map();

  #filmsSort = new SortView;
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsContainerComponent = new FilmsContainer();
  #filmsContainerTopRatedComponent = new FilmsContainer();
  #filmsContainerMostCommentedComponent = new FilmsContainer();
  #noFilmComponent = new NoFilmsView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #currentSortType = SortType.DEFAULT;

  constructor(filmsContainer, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortFilmsByDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortFilmsByRating);
    }

    return this.#filmsModel.films;
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

    this.#renderFilms(films);
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
      case UserAction.ADD_FILM:
        this.#filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_FILM:
        this.#filmsModel.deleteFilm(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };

  #renderFilm = (film, container, presenter) => {
    const filmPresenter = new FilmPresenter(container, this.#handleViewAction);

    filmPresenter.init(film, this.#getFilmComments(film));

    if(presenter === this.#filmPresenter) {
      this.#filmPresenter.set(film.id, filmPresenter);
    } else if (presenter === this.#topRatedPresenter) {
      this.#topRatedPresenter.set(film.id, filmPresenter);
    } else if (presenter === this.#mostCommentedPresenter) {
      this.#mostCommentedPresenter.set(film.id, filmPresenter);
    }
  };

  #getFilmComments = (film) => this.comments.filter(({id}) => film.comments.some((commentId) => commentId === Number(id)));

  #renderFilms = (films, container, presenter) => {
    films.forEach((film) => this.#renderFilm(film, container, presenter));
  };

  #renderFilmList = () => {
    const filmsCount = this.films.length;
    const FILMS_COUNT_ON_START = Math.min(filmsCount, FILM_COUNT_PER_STEP);

    const films = this.films.slice(0, FILMS_COUNT_ON_START);

    this.#renderFilms(films, this.#filmsContainerComponent.element, this.#filmPresenter);

    if (filmsCount.length > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #renderMostCommentedList = () => {
    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(this.#filmsContainerMostCommentedComponent, this.#filmsListMostCommentedComponent.element);

    this.mostCommentedFilms.forEach((film) => this.#renderFilm(film, this.#filmsContainerMostCommentedComponent.element, this.#mostCommentedPresenter));
  };

  #renderTopRatedList = () => {
    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsContainerTopRatedComponent, this.#filmsListTopRatedComponent.element);

    this.topRatedFilms.forEach((film) => this.#renderFilm(film, this.#filmsContainerTopRatedComponent.element, this.#topRatedPresenter));
  };

  #renderNoFilms = () => {
    render(this.#noFilmComponent, this.#filmsComponent.element);
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderFilmList();
  };

  #renderSort = () => {
    render(this.#filmsSort, this.#filmsContainer);
    this.#filmsSort.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderBoard = () => {
    this.#renderSort();
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

    this.#renderFilmList();
    this.#renderMostCommentedList();
    this.#renderTopRatedList();
  };
}
