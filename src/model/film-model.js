import Observable from '../framework/observable.js';
import { generateFilm } from '../mock/film.js';

export default class FilmsModel extends Observable {
  #films = Array.from({length: 6}, generateFilm);

  get films () {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Film');
    }
    console.log('Модель: обновляем фильм - ', update, index, this.#films);

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
