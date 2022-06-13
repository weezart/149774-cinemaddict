import Observable from '../framework/observable.js';
import { generateComment } from '../mock/comment.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({length: 100}, generateComment);

  get comments () {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    console.log('Модель: удаляем комментарий - ', update, index, this.#comments);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting Comments');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
