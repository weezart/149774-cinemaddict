import { remove, render, replace } from '../framework/render.js';
import FilmCommentsView from '../view/film-comments-view.js';
import {UpdateType, UserAction} from '../const.js';

export default class FilmCommentsPresenter {
  #commentsContainer = null;
  #commentsComponent = null;
  #commentsModel = null;
  #changeData = null;
  #film = null;

  constructor(commentsContainer, film, commentsModel, changeData) {
    this.#commentsContainer = commentsContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#film = film;
  }

  destroy = () => {
    remove(this.#commentsComponent);
  };

  init = async (film) => {
    const comments = await this.#commentsModel.init(film).then(() => this.#commentsModel.comments);
    const prevCommentsComponent = this.#commentsComponent;
    this.#commentsComponent = new FilmCommentsView(film, comments);
    this.#commentsComponent.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);
    this.#commentsComponent.setCommentAddHandler(this.#handleCommentAdd);
    if (!prevCommentsComponent) {
      render(this.#commentsComponent, this.#commentsContainer);
      return;
    }
    if (this.#commentsContainer.contains(prevCommentsComponent.element)) {
      replace(this.#commentsComponent, prevCommentsComponent);
    }
    remove(prevCommentsComponent);
  };

  reset = (film) => {
    this.#commentsComponent.reset(film);
  };

  #handleCommentDeleteClick = (commentId) => {
    this.#commentsModel.deleteComment(
      UpdateType.MINOR,
      commentId
    );

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {...this.#film, comments: this.#film.comments.filter((filmCommentId) => filmCommentId !== commentId)}
    );
  };

  #handleCommentAdd = (update) => {
    this.#commentsModel.addComment(
      UpdateType.MINOR,
      update
    );

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {...this.#film, comments: [...this.#film.comments, update.id]}
    );
  };
}
