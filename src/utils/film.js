import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const getDuration = (minutes) => {
  const textHours = minutes / 60 > 0 ? `${(minutes / 60).toFixed(0)}h` : '';
  const textMinutes = minutes % 60 !== 0 ? `${minutes % 60}m` : '';
  return `${textHours} ${textMinutes}`;
};

const getFilmYear = (date) => dayjs(date).get('year');

const humanizeRelativeTime = (date) => date ? dayjs(date).fromNow() : '';

const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');

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

export {getFilmYear, getDuration, humanizeDate, humanizeRelativeTime, sortFilmsByDate, sortFilmsByRating };
