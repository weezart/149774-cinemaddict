import View from './view';

const createLoadMoreButtonTemplate = () => (
  `<button class="films-list__show-more">
    Show more
  </button>`
);

export default class LoadMoreButtonView extends View {
  constructor() {
    super();
  }

  getTemplate() {
    return createLoadMoreButtonTemplate();
  }
}
