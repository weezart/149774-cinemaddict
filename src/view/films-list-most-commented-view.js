import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListMostCommentedTemplate = () => (
  `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>
  `
);

export default class FilmsListMostCommentedView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createFilmsListMostCommentedTemplate();
  }
}
