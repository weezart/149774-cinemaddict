import { generateFilm } from '../mock/film.js';
import { generateComment } from '../mock/comment.js';

export default class FilmsModel {
  comments = Array.from({length: 100}, generateComment);
  films = Array.from({length: 5}, generateFilm);

  getComments = () => this.comments;
  getFilms = () => this.films;
}
