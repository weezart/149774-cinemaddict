import View from './view';

const createStatsTemplate = () => (
  `<section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>`
);

export default class StatsView extends View {
  constructor() {
    super();
  }

  getTemplate() {
    return createStatsTemplate();
  }
}
