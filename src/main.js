import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmModel from './model/film-model.js';
import CommentModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';
import StatsView from './view/stats-view.js';

const AUTHORIZATION = 'Basic hXS2sgf404s4d4gwl1sd2wj';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStatsElement = document.querySelector('.footer__statistics');

const filmModel = new FilmModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentModel = new CommentModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(siteMainElement, siteBodyElement, siteHeaderElement, filmModel, commentModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmModel);

filterPresenter.init();
boardPresenter.init();
filmModel.init()
  .finally(() => {
    render(new StatsView(filmModel.films.length), footerStatsElement);
  });
