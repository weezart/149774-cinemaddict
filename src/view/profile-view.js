import AbstractView from '../framework/view/abstract-view.js';
import { UserRankTitle, UserRankRequirement } from '../const.js';

const getUserRank = (watchedMoviesCount) => {
  switch (true) {
    case (watchedMoviesCount >= UserRankRequirement.MOVIE_BUFF):
      return UserRankTitle.MOVIE_BUFF;
    case (watchedMoviesCount >= UserRankRequirement.FAN):
      return UserRankTitle.FAN;
    case (watchedMoviesCount >= UserRankRequirement.NOVICE):
      return UserRankTitle.NOVICE;
    default:
      return UserRankTitle.NONE;
  }
};

const createProfileTemplate = (watchedFilmsCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(watchedFilmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileView extends AbstractView {
  #watchedFilmsCount = null;

  constructor(watchedFilmsCount) {
    super();

    this.#watchedFilmsCount = watchedFilmsCount;
  }

  get template() {
    return createProfileTemplate(this.#watchedFilmsCount);
  }
}
