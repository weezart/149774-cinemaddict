import dayjs from 'dayjs';
import {getRandomInteger} from './common.js';

let counterComment = 0;
const getIntegerArray = Array.from({length: 100}, () => counterComment++);

const getDuration = (minutes) => {
  const hours = minutes / 60;
  if (hours < 1) {
    return `${minutes}m`;
  } else if ((minutes % 60) === 0) {
    return `${hours.toFixed(0)}h`;
  }
  return `${hours.toFixed(0)}h ${minutes % 60}m` ;
};

const getFilmYear = (date) => dayjs(date).get('year');

const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');

const getRandomDay = (rangeType, min, max) => {
  const daysGap = getRandomInteger(max, min);

  return dayjs().add(daysGap, rangeType).toDate();
};

const getWeightForNull = (A, B) => {
  if (A === null && B === null) {
    return 0;
  }

  if (A === null) {
    return 1;
  }

  if (B === null) {
    return -1;
  }
};

const sortFilmsByDate = (filmA, filmB) => {
  const weight = getWeightForNull(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

const sortFilmsByRating = (filmA, filmB) => {
  const weight = getWeightForNull(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);

  return weight ?? filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
};

export {getFilmYear, getDuration, humanizeDate, getRandomDay, getIntegerArray, sortFilmsByDate, sortFilmsByRating };
