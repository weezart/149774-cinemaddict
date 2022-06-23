import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListTopRatedTemplate = () => (
  `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>
  `
);

export default class FilmsListTopRatedView extends AbstractView {
  get template() {
    return createFilmsListTopRatedTemplate();
  }
}
