import AbstractView from '../framework/view/abstract-view.js';

const createLoadMoreButtonTemplate = () => (
  `<button class="films-list__show-more">
    Show more
  </button>`
);

export default class LoadMoreButtonView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createLoadMoreButtonTemplate();
  }
}
