import View from './view';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>
  `
);

export default class FilmsListView extends View {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsListTemplate();
  }
}
