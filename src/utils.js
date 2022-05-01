import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

// Массив заданной длины случайных элементов.
const getRandomizedReducedArray = (array, count) => {
  return array.slice().sort(() => Math.random() - 0.5).slice(0, count);
};

const getRandomDecimalNumber = (max, min) => ((Math.random() * (max - min)) + min).toFixed(1);

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

const getFilmDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');

const getPublishDate = (date) => dayjs(date).format('DD MMMM YYYY');

const getRandomDay = (rangeType, min, max) => {
  const daysGap = getRandomInteger(max, min);

  return dayjs().add(daysGap, rangeType).toDate();
};

export {getRandomInteger, getRandomArrayItem, getRandomizedReducedArray, getRandomDecimalNumber, getFilmYear, getDuration, getFilmDate, getPublishDate, getRandomDay };
