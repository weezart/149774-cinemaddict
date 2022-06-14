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
const getRandomizedReducedArray = (array, count) => array.slice().sort(() => Math.random() - 0.5).slice(0, count);


const generateDate = () => {
  const daysGap = getRandomInteger(-1, -60);

  return dayjs().add(daysGap, 'day').toDate();
};

export {getRandomInteger, getRandomArrayItem, getRandomizedReducedArray, generateDate};
