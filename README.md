# tasksf [![npm version](https://img.shields.io/npm/v/tasksf.svg?style=flat)](https://www.npmjs.com/package/tasksf) [![Build Status](https://img.shields.io/travis/ranapat/tasksf/master.svg?style=flat)](https://travis-ci.org/ranapat/tasksf)
Simple tasks manager factory

### Run your code based on tasks

#### Examples:

##### Easy import
```javascript
import { tf } from 'tasksf';
```

##### Simple tasks in a sequence
```javascript
const task1 = tf.task(
  () => console.log('task 1 run')
);
const task2 = tf.task(
  () => console.log('task 2 run')
);

tf.sequence()
  .push(task1)
  .push(task2)
  .run();
```

##### Simple tasks in a parallel
```javascript
const task1 = tf.task(
  1,
  () => console.log('task 1 run')
);
const task2 = tf.task(
  2,
  () => console.log('task 2 run')
);

tf.parallel()
  .push(task1)
  .push(task2)
  .run();
```

##### Simple tasks in a loop
```javascript
const task1 = tf.task(
  1,
  () => console.log('task 1 run')
);
const task2 = tf.task(
  () => console.log('task 2 run')
);

tf.loop()
  .push(task1)
  .push(task2)
  .run();
```

#### Documentation

[Check the documentation](http://github.com/ranapat/tasksf/blob/master/docs/docs.md)

#### More examples

[Check out use.tasksf](http://github.com/ranapat/use.tasksf)