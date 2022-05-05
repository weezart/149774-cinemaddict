import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view';
import FilmsContainer from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmDetailView from '../view/film-detail-view';
import NoFilmsView from '../view/no-films-view';
import {render, RenderPosition} from '../render.js';
import {IS_PRESSED_ESCAPE_KEY, FILM_COUNT_PER_STEP} from '../const.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmsList = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsContainerComponent = new FilmsContainer();
  #filmsContainerTopRatedComponent = new FilmsContainer();
  #filmsContainerMostCommentedComponent = new FilmsContainer();
  #loadMoreButtonComponent = new LoadMoreButtonView();

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#filmsList = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];

    this.#renderFilms();
  };

  #handleLoadMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#filmsList
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.element));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #renderFilmsComponents = () => {
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);
    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(this.#filmsContainerTopRatedComponent, this.#filmsListTopRatedComponent.element);
    render(this.#filmsContainerMostCommentedComponent, this.#filmsListMostCommentedComponent.element);
  };

  #renderFilm = (film, container) => {
    const filmCardComponent = new FilmCardView(film);

    const footerElement = document.querySelector('.footer');

    const onDocumentEscKeydown = (evt) => {
      if (IS_PRESSED_ESCAPE_KEY(evt)) {
        evt.preventDefault();
        hideFilmDetail();
      }
    };

    const showFilmDetail = (comments) => {
      const filmPopupComponent = new FilmDetailView(film, comments);

      filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', hideFilmDetail);

      render(filmPopupComponent, footerElement, RenderPosition.AFTEREND);
      document.body.addEventListener('keydown', onDocumentEscKeydown);
      document.body.classList.add('hide-overflow');
    };

    function hideFilmDetail() {
      document.body.classList.remove('hide-overflow');
      document.body.removeEventListener('keydown', onDocumentEscKeydown);
      document.querySelector('.film-details').remove();
    }

    filmCardComponent.element.addEventListener('click', () => {
      const filmComments = this.#comments.filter(({id}) => film.comments.some((commentId) => commentId === Number(id)));

      if (document.body.classList.contains('hide-overflow')) {
        hideFilmDetail();
      }

      showFilmDetail(filmComments);
    });

    render(filmCardComponent, container);
  };

  #renderFilms = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#filmsList.length > 0) {
      this.#renderFilmsComponents();

      for (let i = 0; i < Math.min(this.#filmsList.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#filmsList[i], this.#filmsContainerComponent.element);
      }

      for (let i = 0; i < 2; i++) {
        this.#renderFilm(this.#filmsList[i], this.#filmsContainerMostCommentedComponent.element);
        this.#renderFilm(this.#filmsList[i], this.#filmsContainerTopRatedComponent.element);
      }

      if (this.#filmsList.length > FILM_COUNT_PER_STEP) {
        render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);

        this.#loadMoreButtonComponent.element.addEventListener('click', this.#handleLoadMoreButtonClick);
      }
    } else {
      render(new NoFilmsView(), this.#filmsComponent.element);
    }
  };
}
