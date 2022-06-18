import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get comments () {
    return this.#comments;
  }

  set comments (comments) {
    this.#comments = comments;
  }

  init = async (film) => {
    try {
      this.#comments = await this.#filmsApiService.getComments(film);
    } catch (err) {
      this.#comments = [];
      throw new Error('Can\'t get comments by film ID');
    }
  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = async (updateType, comments, id) => {
    this.#comments = comments;
    const index = this.#comments.findIndex((comment) => comment.id === id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#filmsApiService.deleteComment(id);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
    } catch {
      throw new Error('Can\'t delete comment');
    }
  };
}
