import ProfileView from './view/profile-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/film-model.js';
import CommentsModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';

const AUTHORIZATION = 'Basic hXS2sgf404s4d4gwl1sd2wj';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStatsElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(siteMainElement, siteBodyElement, footerStatsElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(new ProfileView(), siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
filmsModel.init();
