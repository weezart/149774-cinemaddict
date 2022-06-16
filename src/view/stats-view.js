import AbstractView from '../framework/view/abstract-view.js';

const createStatsTemplate = (filmsCount) => (
  `<p>${filmsCount} movies inside</p>`
);

export default class StatsView extends AbstractView {
  #filmsCount = null;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createStatsTemplate(this.#filmsCount);
  }
}
