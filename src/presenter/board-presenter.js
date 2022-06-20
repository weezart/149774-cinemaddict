import {render, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {SortType, FilterType, UpdateType, UserAction, FILM_COUNT_PER_STEP, EXTRA_FILM_COUNT, TimeLimit} from '../const.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import {filterFilms} from '../utils/filter.js';
import SortView from '../view/sort-view.js';
import StatsView from '../view/stats-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';
import FilmsContainer from '../view/films-container-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoFilmsView from '../view/no-films-view';
import LoadingView from '../view/loading-view.js';
import FilmPresenter from './film-presenter.js';


export default class BoardPresenter {
  #boardContainer = null;
  #pageBodyElement = null;
  #footerStatsElement = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #noFilmComponent = null;
  #sortComponent = null;
  #footerStatsComponent = null;
  #loadMoreButtonComponent = null;
  #openFilmPresenter = null;
  #pagePosition = null;

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

  constructor(boardContainer, pageBodyElement, footerStatsElement, filmsModel, commentsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#pageBodyElement = pageBodyElement;
    this.#footerStatsElement = footerStatsElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filmsFilter;
    const films = this.#filmsModel.films;
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch (err) {
          this.#filmPresenter.get(update.id)[0].setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmPresenter.get(update.updatedFilm.id)[0].setDeleting(update.commentId);
        try {
          await this.#commentsModel.deleteComment(updateType, update.comments, update.commentId);
          await this.#filmsModel.updateFilm(updateType, update.updatedFilm);
        } catch (err) {
          this.#filmPresenter.get(update.updatedFilm.id)[0].setAborting();
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmPresenter.get(update.id)[0].setAdding();
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch (err) {
          this.#filmPresenter.get(update.id)[0].setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModeChange = () => {
    this.#filmPresenter
      .forEach((value) => value
        .forEach((presenter) => presenter.resetView()));
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
        remove(this.#footerStatsComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#pageBodyElement, this.#commentsModel, this.#handleViewAction, this.#handleModeChange);

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
    remove(this.#footerStatsComponent);

    this.#renderedFilmCount = resetRenderedFilmsCount
      ? FILM_COUNT_PER_STEP
      : Math.min(filmsCount, this.#renderedFilmCount);

    this.#currentSortType = resetSortType
      ? SortType.DEFAULT
      : this.#currentSortType;
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element);
  };

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);

    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
  };

  #renderFooterStatsComponent = (filmsCount) => {
    this.#footerStatsComponent = new StatsView(filmsCount);

    render(this.#footerStatsComponent, this.#footerStatsElement);
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
    this.#openFilmPresenter.init(updateFilm);
  };

  #renderBoard = () => {
    const films = this.films;

    const filmsCount = films.length;
    this.#renderFooterStatsComponent(filmsCount);

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
