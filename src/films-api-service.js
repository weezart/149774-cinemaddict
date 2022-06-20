import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST'
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (film) => this._load({url: `comments/${film.id}`}).then(ApiService.parseResponse);

  deleteComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE
    });

    return response;
  };

  addComment = async (filmId, comment) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {
      id: film.id,
      comments: film.comments,
      'film_info': {...film.filmInfo,
        'age_rating': film.filmInfo.ageRating,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        release: {
          date: film.filmInfo.release.date instanceof Date ? film.filmInfo.release.date.toISOString() : null,
          'release_country': film.filmInfo.release.releaseCountry
        }
      },
      'user_details': {...film.userDetails,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate instanceof Date ? film.userDetails.watchingDate.toISOString() : null
      }
    };

    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.totalRating;
    delete adaptedFilm.user_details.alreadyWatched;
    delete adaptedFilm.user_details.watchingDate;

    return adaptedFilm;
  };
}
