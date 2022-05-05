import View from './view';

const createNoFilmsTemplate = () => (
  `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>

      <!--
        Значение отображаемого текста зависит от выбранного фильтра:
          * All movies – 'There are no movies in our database'
          * Watchlist — 'There are no movies to watch now';
          * History — 'There are no watched movies now';
          * Favorites — 'There are no favorite movies now'.
      -->
    </section>
  `
);

export default class createNoFilmsView extends View {
  constructor() {
    super();
  }

  get template() {
    return createNoFilmsTemplate();
  }
}
