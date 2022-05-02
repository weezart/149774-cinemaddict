import ProfileView from './view/profile-view.js';
import StatsView from './view/stats-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import {render} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/film-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const footerStatsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter();

render(new ProfileView(), siteHeaderElement);
render(new StatsView(), footerStatsElement);
render(new MenuView(), siteMainElement);
render(new SortView(), siteMainElement);

filmsPresenter.init(siteMainElement, filmsModel);
