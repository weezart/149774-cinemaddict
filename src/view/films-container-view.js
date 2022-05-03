import View from './view';

const createFilmsContainerTemplate = () => (
  `<div class="films-list__container"></div>
  `
);

export default class FilmsContainer extends View {
  constructor() {
    super();
  }

  get template() {
    return createFilmsContainerTemplate();
  }
}
