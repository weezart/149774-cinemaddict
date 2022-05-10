import AbstractView from '../framework/view/abstract-view.js';

const createStatsTemplate = () => (
  `<section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>`
);

export default class StatsView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createStatsTemplate();
  }
}
