import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view';
import FilmsContainer from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmDetailView from '../view/film-detail-view';
import {render, RenderPosition} from '../render.js';

const footerElement = document.querySelector('.footer');

const isPressedEscapeKey = (evt) => evt.key === 'Escape';

const onDocumentEscKeydown = (evt) => {
  if (isPressedEscapeKey(evt)) {
    evt.preventDefault();
    hideFilmDetail();
  }
};

const showFilmDetail = (film, comments) => {
  document.body.classList.add('hide-overflow');
  render(new FilmDetailView(film, comments),  footerElement, RenderPosition.AFTEREND);
  document.body.addEventListener('keydown', onDocumentEscKeydown);
  document.querySelector('.film-details__close-btn').addEventListener('click', hideFilmDetail);
};

function hideFilmDetail () {
  document.body.classList.remove('hide-overflow');
  document.body.removeEventListener('keydown', onDocumentEscKeydown);
  document.querySelector('.film-details').remove();
}

export default class FilmsPresenter {
  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView();
  filmsListTopRatedComponent = new FilmsListTopRatedView();
  filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  filmsContainerComponent = new FilmsContainer();
  filmsContainerTopRatedComponent = new FilmsContainer();
  filmsContainerMostCommentedComponent = new FilmsContainer();

  init = (filmsContainer, filmsModel) => {
    this.filmsContainer = filmsContainer;
    this.filmsModel = filmsModel;
    this.filmsList = [...this.filmsModel.getFilms()];
    this.comments = [...this.filmsModel.getComments()];

    render(this.filmsComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < this.filmsList.length; i++) {
      render(new FilmCardView(this.filmsList[i]), this.filmsContainerComponent.getElement());
    }

    render(this.filmsListTopRatedComponent, this.filmsComponent.getElement());
    render(this.filmsListMostCommentedComponent, this.filmsComponent.getElement());

    render(this.filmsContainerTopRatedComponent, this.filmsListTopRatedComponent.getElement());
    render(this.filmsContainerMostCommentedComponent, this.filmsListMostCommentedComponent.getElement());

    for (let i = 0; i < 2; i++) {
      render(new FilmCardView(this.filmsList[i]), this.filmsContainerTopRatedComponent.getElement());
      render(new FilmCardView(this.filmsList[i]), this.filmsContainerMostCommentedComponent.getElement());
    }

    const filmCards = document.querySelectorAll('.film-card');

    filmCards.forEach((card) => card.addEventListener('click', () => {
      const currentFilm = this.filmsList.find((film) => film.id === Number(card.dataset.id));
      const filmComments = this.comments.filter(({id}) => currentFilm.comments.some((commentId) => commentId === Number(id)));
      showFilmDetail(currentFilm, filmComments);
    }));

    render(new LoadMoreButtonView(), this.filmsListComponent.getElement());
  };
}
