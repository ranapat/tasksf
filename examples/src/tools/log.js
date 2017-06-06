export default function log(message, level = 0) {
  message = message !== undefined ? message : '';

  let color;
  if (message.indexOf('---') === 0) {
    color = '\x1b[33m';
    level = 0;
  } else if (message.indexOf('+++') === 0) {
    color = '\x1b[32m';
    level = 0;
  } else {
    color = '\x1b[36m';
    level = 1;
  }

  console.log(color, ' '.repeat(level * 2) + message);
};
