import ProfileView from './view/profile-view.js';
import StatsView from './view/stats-view.js';
import FiltersView from './view/filters-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter';
import FilmsModel from './model/film-model.js';
import CommentsModel from './model/comment-model.js';
import {generateFilter} from './mock/filter.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const footerStatsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, commentsModel);
const filters = generateFilter(filmsModel.films);

render(new ProfileView(), siteHeaderElement);
render(new StatsView(), footerStatsElement);
render(new FiltersView(filters), siteMainElement);

boardPresenter.init();
