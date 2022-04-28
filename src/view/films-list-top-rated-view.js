import View from './view';

const createFilmsListTopRatedTemplate = () => (
  `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>
  `
);

export default class FilmsListTopRatedView extends View {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsListTopRatedTemplate();
  }
}
