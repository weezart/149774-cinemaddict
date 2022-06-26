import {render, remove, replace} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {SortType, FilterType, UpdateType, UserAction, FILM_COUNT_PER_STEP, EXTRA_FILM_MIN_COUNT, EXTRA_FILM_COUNT, TimeLimit} from '../const.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import { getFilteredMovies } from '../utils/filter.js';
import {filterFilms} from '../utils/filter.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';
import FilmsContainer from '../view/films-container-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoFilmsView from '../view/no-films-view';
import LoadingView from '../view/loading-view.js';
import ProfileView from '../view/profile-view.js';
import FilmPresenter from './film-presenter.js';


export default class BoardPresenter {
  #boardContainer = null;
  #pageBodyElement = null;
  #pageHeaderElement = null;
  #filmModel = null;
  #commentModel = null;
  #filterModel = null;
  #noFilmComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #openFilmPresenter = null;
  #pagePosition = null;
  #profileComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #filmPresenter = new Map();

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #loadingComponent = new LoadingView();
  #filmsContainerComponent = new FilmsContainer();
  #filmsContainerTopRatedComponent = new FilmsContainer();
  #filmsContainerMostCommentedComponent = new FilmsContainer();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(boardContainer, pageBodyElement, pageHeaderElement, filmModel, commentModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#pageBodyElement = pageBodyElement;
    this.#pageHeaderElement = pageHeaderElement;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;

    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filmsFilter;
    const films = this.#filmModel.films;
    const filteredFilms = filterFilms[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...filteredFilms].sort(sortFilmsByDate);
      case SortType.RATING:
        return [...filteredFilms].sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  get topRatedFilms () {
    const topRatedFilms = [...this.#filmModel.films]
      .filter((film) => film.filmInfo.totalRating > 0)
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, Math.min(this.films.length, EXTRA_FILM_COUNT));

    return ((topRatedFilms.length > 1)
      && topRatedFilms[0].filmInfo.totalRating !== topRatedFilms[1].filmInfo.totalRating)
      ? [...topRatedFilms].slice(0, EXTRA_FILM_MIN_COUNT)
      : topRatedFilms;
  }

  get mostCommentedFilms () {
    const mostCommentedFilms = [...this.#filmModel.films]
      .filter((film) => film.comments.length > 0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, Math.min(this.films.length, EXTRA_FILM_COUNT));

    return ((mostCommentedFilms.length > 1)
      && mostCommentedFilms[0].comments.length !== mostCommentedFilms[1].comments.length)
      ? [...mostCommentedFilms].slice(0, EXTRA_FILM_MIN_COUNT)
      : mostCommentedFilms;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderProfile = () => {
    const prevProfileComponent = this.#profileComponent;
    const watchedFilmsCount = getFilteredMovies(FilterType.HISTORY, this.#filmModel.films).length;

    this.#profileComponent = new ProfileView(watchedFilmsCount);

    if (prevProfileComponent === null) {
      render(this.#profileComponent, this.#pageHeaderElement);
      return;
    }

    replace(this.#profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmModel.updateFilm(updateType, update);
        } catch (err) {
          this.#filmPresenter.get(update.id).forEach((item) => {
            item.setAborting();
          });
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#filmModel.updateFilm(updateType, update);
        } catch (err) {
          this.#filmPresenter.get(update.id).forEach((item) => {
            item.setAborting();
          });
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          await this.#filmModel.updateFilm(updateType, update);
        } catch (err) {
          this.#filmPresenter.get(update.id).forEach((item) => {
            item.setAborting();
          });
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id)[0].init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#pageBodyElement, this.#commentModel, this.#handleViewAction);

    filmPresenter.init(film);

    if (this.#filmPresenter.has(film.id)) {
      this.#filmPresenter.get(film.id).push(filmPresenter);
      return;
    }
    this.#filmPresenter.set(film.id, [filmPresenter]);
  };

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
    remove(this.#loadingComponent);

    this.#renderedFilmCount = resetRenderedFilmsCount
      ? FILM_COUNT_PER_STEP
      : Math.min(filmsCount, this.#renderedFilmCount);

    this.#currentSortType = resetSortType
      ? SortType.DEFAULT
      : this.#currentSortType;
  };

  #renderMostCommentedList = () => {
    if (this.mostCommentedFilms.length === 0) {
      return;
    }

    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(this.#filmsContainerMostCommentedComponent, this.#filmsListMostCommentedComponent.element);

    this.mostCommentedFilms.forEach((film) => this.#renderFilm(film, this.#filmsContainerMostCommentedComponent.element));
  };

  #renderTopRatedList = () => {
    if (this.topRatedFilms.length === 0) {
      return;
    }

    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsContainerTopRatedComponent, this.#filmsListTopRatedComponent.element);

    this.topRatedFilms.forEach((film) => this.#renderFilm(film, this.#filmsContainerTopRatedComponent.element));
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmsView(this.#filterType);
    render(this.#noFilmComponent, this.#filmsComponent.element);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element);
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

    const updateFilm = this.#filmModel.films.filter((film) => film.id === this.#openFilmPresenter.film.id)[0];
    this.#openFilmPresenter.init(updateFilm);
  };

  #renderBoard = () => {
    this.#renderProfile();

    const films = this.films;
    const filmsCount = films.length;

    if (filmsCount !== 0) {
      this.#renderSort();
    }

    render(this.#filmsComponent, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
