import {getRandomArrayItem, getRandomizedReducedArray, getRandomInteger} from '../utils/common.js';
import {getIntegerArray, getRandomDay} from '../utils/film.js';

export const FILM_NAMES = [
  'Made for Each Other',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with the Golden Arm',
];

export const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

export const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

export const DIRECTOR_NAMES = [
  'Anthony Mann',
  'John Dighton',
  'William Wyler',
  'Neil Burger',
  'Brendon Boyea',
  'Luca Bucura',
];

export const WRITERS = [
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Dalton Trumbo',
  'Ian McLellan Hunter',
  'John Dighton',
  'Henri Alekan',
  'Franz Planer',
  'Georges Auric',
  'Hal Pereira',
  'Walter H. Tyler',
];

export const ACTORS = [
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
  'Gregory Peck',
  'Audrey Hepburn',
  'Eddie Albert',
  'Hartley Power',
  'Harcourt Williams',
  'Margaret Rawlings',
  'Tullio Carminati',
  'Paolo Carlini',
  'Claudio Ermelli',
  'Paola Borboni',
];

export const GENRES = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery',
  'Film-Noir',
];

export const COUNTRIES = [
  'USA',
  'India',
  'France',
  'Canada',
  'Russia',
  'UK'
];

let counterFilm = 0;

export const generateFilm = () => ({
  id: counterFilm++,
  comments: getRandomizedReducedArray(getIntegerArray, getRandomInteger(0, 5)),
  filmInfo: {
    title: getRandomArrayItem(FILM_NAMES),
    alternativeTitle: getRandomArrayItem(FILM_NAMES),
    totalRating: getRandomInteger(10, 100) / 10,
    poster: getRandomArrayItem(POSTERS),
    ageRating: getRandomInteger(0, 18),
    director: getRandomArrayItem(DIRECTOR_NAMES),
    writers: getRandomizedReducedArray(WRITERS, getRandomInteger(1, 3)),
    actors: getRandomizedReducedArray(ACTORS, getRandomInteger(1, 5)),
    release: {
      date: getRandomDay('year', -40, 0),
      releaseCountry: getRandomArrayItem(COUNTRIES),
    },
    runtime: getRandomInteger(20, 180),
    genre: getRandomizedReducedArray(GENRES, getRandomInteger(0, 3)),
    description: getRandomizedReducedArray(DESCRIPTIONS, getRandomInteger(1, 5)).join(''),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: Boolean(getRandomInteger(0, 1))
  },
});
