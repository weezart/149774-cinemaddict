import ProfileView from './view/profile-view.js';
import StatsView from './view/stats-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/film-model.js';
import CommentsModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const footerStatsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(new ProfileView(), siteHeaderElement);
render(new StatsView(), footerStatsElement);

filterPresenter.init();
boardPresenter.init();
