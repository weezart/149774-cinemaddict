import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class FilterModel extends Observable {
  #filmsFilter = FilterType.ALL;

  get filmsFilter() {
    return this.#filmsFilter;
  }

  setFilter = (updateType, fimsFilter) => {
    this.#filmsFilter = fimsFilter;
    this._notify(updateType, fimsFilter);
  };
}
