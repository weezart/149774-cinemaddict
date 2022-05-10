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

export {getFilmYear, getDuration, humanizeDate, getRandomDay, getIntegerArray };
