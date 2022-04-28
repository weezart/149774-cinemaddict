import {createElement} from '../render.js';

const createFilmsContainerTemplate = () => (
  `<div class="films-list__container"></div>
  `
);

export default class FilmsContainer {
  getTemplate() {
    return createFilmsContainerTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
