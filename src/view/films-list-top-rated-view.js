import View from './view';

const createFilmsListTopRatedTemplate = () => (
  `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>
  `
);

export default class FilmsListTopRatedView extends View {
  constructor() {
    super();
  }

  get template() {
    return createFilmsListTopRatedTemplate();
  }
}
