import ProfileView from './view/profile-view.js';
import StatsView from './view/stats-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import FilmDetailView from './view/film-detail-view';
import {render, RenderPosition} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');
const filmsPresenter = new FilmsPresenter();

render(new ProfileView(), siteHeaderElement);
render(new StatsView(), footerStatsElement);
render(new MenuView(), siteMainElement);
render(new SortView(), siteMainElement);

render(new FilmDetailView(), footerElement, RenderPosition.AFTEREND);


const filmDetailsElement = document.querySelector('.film-details');
const filmDetailsCloseBtnElement = filmDetailsElement.querySelector('.film-details__close-btn');

filmDetailsCloseBtnElement.addEventListener('click', () => {
  filmDetailsElement.style.display = 'none';
});

filmsPresenter.init(siteMainElement);
