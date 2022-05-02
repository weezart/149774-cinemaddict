import {getRandomArrayItem, getRandomDay} from '../utils.js';
import {COMMENT_EMOTIONS} from '../const.js';

const COMMENTS = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
];

const COMMENT_AUTHORS = ['John Doe', 'Tim Macoveev'];

let counter = 0;

export const generateComment = () => ({
  id: counter++,
  author: getRandomArrayItem(COMMENT_AUTHORS),
  comment: getRandomArrayItem(COMMENTS),
  emotion: getRandomArrayItem(COMMENT_EMOTIONS),
  date: getRandomDay('day', -7, 0)
});
