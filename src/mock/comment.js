import {getRandomArrayItem} from "../utils.js";

const COMMENTS = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
];

const COMMENT_AUTHORS = ['John Doe', 'Tim Macoveev'];
const COMMENT_EMOTIONS = ['angry', 'puke', 'sleeping', 'smile'];
const MILLISECONDS_IN_YEAR = 1000 * 60 * 60 * 24 * 30 * 12;

let counter = 0;

export const generateComment = () => {
  return {
    id: counter++,
    message: getRandomArrayItem(COMMENTS),
    emotion: getRandomArrayItem(COMMENT_EMOTIONS),
    author: getRandomArrayItem(COMMENT_AUTHORS),
    commentDate: Date.now() - Math.round(Math.random() * MILLISECONDS_IN_YEAR)
  };
};
