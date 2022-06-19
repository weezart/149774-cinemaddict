import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate } from '../utils/film.js';
import he from 'he';
import {COMMENT_EMOTIONS} from '../const.js';

const createFilmListTemplate = (film, commentsList) => {
  const commentEmojiTemplate = film.commentEmoji ?
    `<img src="images/emoji/${film.commentEmoji}.png" width="55" height="55" alt="emoji-${film.commentEmoji}}">`
    : '';

  return (`
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsList.length}</span></h3>
        <ul class="film-details__comments-list">
           ${commentsList.map((it) => `
              <li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${it.emotion}.png" width="55" height="55" alt="emoji-${it.emotion}">
                </span>
                <div>
                  <p class="film-details__comment-text">${he.encode(it.comment)}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${it.author}</span>
                    <span class="film-details__comment-day">${humanizeDate(it.date)}</span>
                    <button class="film-details__comment-delete" data-target-comment="${it.id}">Delete</button>
                  </p>
                </div>
              </li>
            `).join('\n')}
        </ul>
        <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                ${commentEmojiTemplate}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${film.commentText ? film.commentText : ''}</textarea>
              </label>

              <div class="film-details__emoji-list">
                ${COMMENT_EMOTIONS.map((it) => `
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${it}" value="${it}">
                  <label class="film-details__emoji-label" for="emoji-${it}">
                    <img src="./images/emoji/${it}.png" width="30" height="30" alt="emoji">
                  </label>
                `).join('')}
              </div>
            </div>
      </section>
    </div>
  `);
};

export default class FilmCommentsView extends AbstractStatefulView {
  #comments = null;

  constructor(film, comments) {
    super();

    this._state = FilmCommentsView.parseFilmToState(film);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmListTemplate(this._state, this.#comments);
  }

  static parseFilmToState = (film) => ({
    ...film,
    commentEmoji: null,
    commentText: null,
    scrollTop: null,
    isDisabled: false,
  });

  setCommentDeleteClickHandler = (callback) => {
    this._callback.commentDeleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((element) => element.addEventListener('click', this.#commentDeleteClickHandler));
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.dataset.targetComment;
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isDeleting: true,
    });
    evt.target.textContent = 'Deleting...';
    this._callback.commentDeleteClick(commentId);
  };

  setCommentAddHandler = (callback) => {
    this._callback.commentAdd = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#commentAddHandler);
  };

  #commentAddHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === 13 && this._state.commentEmoji) {
      this._callback.commentAdd({
        comment: this._state.commentText,
        emotion: this._state.commentEmoji,
      });
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    this.setCommentAddHandler(this._callback.commentAdd);
  };

  #restorePosition = () => {
    this.element.scrollTop = this._state.scrollTop;
    this.element.querySelector('.film-details__comment-input').scrollTop = this._state.scrollTop;
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((element) => element.addEventListener('click', this.#filmCommentEmojiClickHandler));
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  #filmCommentEmojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      commentEmoji: evt.target.value,
      scrollTop: this.element.scrollTop
    });
    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((elem) => {
        elem.checked = false;
      });
    evt.target.checked = true;
    this.#restorePosition();
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      commentText: evt.target.value,
    });
    this.#restorePosition();
  };

  reset = (film) => {
    this.updateElement(
      FilmCommentsView.parseFilmToState(film),
    );
  };
}
