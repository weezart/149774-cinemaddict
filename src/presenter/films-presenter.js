import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view';
import FilmsContainer from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView();
  filmsListTopRatedComponent = new FilmsListTopRatedView();
  filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  filmsContainerComponent = new FilmsContainer();
  filmsContainerTopRatedComponent = new FilmsContainer();
  filmsContainerMostCommentedComponent = new FilmsContainer();

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    render(this.filmsComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsContainerComponent.getElement());
    }

    render(this.filmsListTopRatedComponent, this.filmsComponent.getElement());
    render(this.filmsListMostCommentedComponent, this.filmsComponent.getElement());

    render(this.filmsContainerTopRatedComponent, this.filmsListTopRatedComponent.getElement());
    render(this.filmsContainerMostCommentedComponent, this.filmsListMostCommentedComponent.getElement());

    for (let i = 0; i < 2; i++) {
      render(new FilmCardView(), this.filmsContainerTopRatedComponent.getElement());
      render(new FilmCardView(), this.filmsContainerMostCommentedComponent.getElement());
    }

    render(new LoadMoreButtonView(), this.filmsListComponent.getElement());
  };
}
