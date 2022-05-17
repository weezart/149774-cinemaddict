import {render, remove} from '../framework/render.js';
import {FILM_COUNT_PER_STEP, EXTRA_FILM_COUNT} from '../const.js';
import {updateItem} from '../utils/common.js';
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
  #filmsList = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsContainerComponent = new FilmsContainer();
  #filmsContainerTopRatedComponent = new FilmsContainer();
  #filmsContainerMostCommentedComponent = new FilmsContainer();
  #noFilmComponent = new NoFilmsView();
  #loadMoreButtonComponent = new LoadMoreButtonView();

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#filmsList = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];

    this.#renderBoard();
  };

  #handleLoadMoreButtonClick = () => {
    this.#filmsList
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.element));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleFilmChange = (updatedFilm) => {
    this.#filmsList = updateItem(this.#filmsList, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#comments);
  };

  #renderFilm = (film, container, isMainFilmList) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange);

    filmPresenter.init(film, this.#comments);

    if (isMainFilmList) {
      this.#filmPresenter.set(film.id, filmPresenter);
    }
  };

  #renderFilms = (from, to, container, isMainFilmList = false) => {
    this.#filmsList
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, container, isMainFilmList));
  };

  #renderFilmList = () => {
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

    const IS_MAIN_FILM_LIST = true;
    const FILMS_COUNT_ON_START = Math.min(this.#filmsList.length, FILM_COUNT_PER_STEP);

    this.#renderFilms(0, FILMS_COUNT_ON_START, this.#filmsContainerComponent.element, IS_MAIN_FILM_LIST);

    if (this.#filmsList.length > FILM_COUNT_PER_STEP) {
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

    this.#renderFilms(0, EXTRA_FILM_COUNT, this.#filmsContainerMostCommentedComponent.element);
  };

  #renderTopRatedList = () => {
    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsContainerTopRatedComponent, this.#filmsListTopRatedComponent.element);

    this.#renderFilms(0, EXTRA_FILM_COUNT, this.#filmsContainerTopRatedComponent.element);
  };

  #renderNoFilms = () => {
    render(this.#noFilmComponent, this.#filmsComponent.element);
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #renderBoard = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#filmsList.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmList();
    this.#renderMostCommentedList();
    this.#renderTopRatedList();
  };
}
