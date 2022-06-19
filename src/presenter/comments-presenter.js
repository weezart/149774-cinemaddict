import { remove, render, replace } from '../framework/render.js';
import FilmCommentsView from '../view/film-comments-view.js';
import {Mode, UpdateType, UserAction} from '../const.js';

export default class FilmCommentsPresenter {
  #commentsContainer = null;
  #commentsComponent = null;
  #commentsModel = null;
  #changeData = null;
  #film = null;
  #comments = null;
  #mode = 'OPENED';

  constructor(commentsContainer, film, commentsModel, changeData, mode) {
    this.#commentsContainer = commentsContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#film = film;
    this.#mode = mode;
  }

  destroy = () => {
    remove(this.#commentsComponent);
  };

  init = async (film) => {
    this.#comments = await this.#commentsModel.init(film).then(() => this.#commentsModel.comments);
    const prevCommentsComponent = this.#commentsComponent;
    this.#commentsComponent = new FilmCommentsView(film, this.#comments);
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

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#commentsComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    console.log('Запуск удаления', this.#mode);
    if (this.#mode === Mode.EDITING) {
      this.#commentsComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  #handleCommentDeleteClick = (commentId) => {
    this.#commentsModel.deleteComment(
      UpdateType.MINOR,
      this.#comments,
      commentId
    );

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {...this.#film, comments: this.#film.comments.filter((filmCommentId) => filmCommentId !== commentId)}
    );
  };

  #handleCommentAdd = async (update) => {
    const updatedFilm = await this.#commentsModel.addComment(
      UpdateType.MINOR,
      this.#film.id,
      update
    );

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      { ...this.#film, comments: updatedFilm.comments }
    );
  };
}
