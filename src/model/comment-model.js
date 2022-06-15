import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments =[];

  // constructor(commentsApiService) {
  //   super();
  //   this.#commentsApiService = commentsApiService;
  // }

  get comments () {
    return this.#comments;
  }

  init = async () => {
    // try {
    //   const comments = await this.#commentsApiService.comments;
    //   this.#comments = comments;
    // } catch(err) {
    //   this.#comments = [];
    // }


    //this._notify(UpdateType.INIT);
  };

  set comments(comments) {
    this.#comments = comments;
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
