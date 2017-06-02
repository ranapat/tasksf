# tasksf [![npm version](https://img.shields.io/npm/v/tasksf.svg?style=flat)](https://www.npmjs.com/package/tasksf) [![Build Status](https://img.shields.io/travis/ranapat/tasksf/master.svg?style=flat)](https://travis-ci.org/ranapat/tasksf) [![Coverage Status](https://coveralls.io/repos/ranapat/tasksf/badge.svg?branch=master)](https://coveralls.io/r/ranapat/tasksf?branch=master)
Simple tasks manager factory

### Run your code based on tasks

#### Install:

##### Install with npm
```bash
npm install tasksf
```

#### Use standalone
```html
<script src="https://cdn.jsdelivr.net/npm/tasksf/standalone/tasksf.js"></script>
or
<script src="https://cdn.jsdelivr.net/npm/tasksf/standalone/tasksf.min.js"></script>
```

#### Access the library:

##### Import
```javascript
import { tf } from 'tasksf';
```

##### Require
```javascript
const tasksf = require('tasksf');
```

##### Standalone
```html
<script src="https://cdn.jsdelivr.net/npm/tasksf/standalone/tasksf.min.js"></script>
<script>
// global tasksf variable exists
// tasksf.tf - factory
// tasksf.Task - task
// and so on
</script>
```

#### Examples:

##### Simple tasks in a sequence
```javascript
const task1 = tf.task(
  () => console.log('task 1 run'),
  () => console.log('task 1 complete')
);
const task2 = tf.task(
  () => console.log('task 2 run'),
  () => console.log('task 2 complete')
);

tf.sequence(() => console.log('sequence complete'))
  .push(task1)
  .push(task2)
  .run();

/**
 * Expected output:
 * task 1 run, task 1 complete,
 * task 2 run, task 2 complete,
 * sequence complete
 */
```

##### Simple tasks in a loop
```javascript
const task1 = tf.task(
  1,
  () => console.log('task 1 run'),
  () => console.log('task 1 complete')
);
const task2 = tf.task(
  () => console.log('task 2 run'),
  () => console.log('task 2 complete')
);

tf.loop(2, () => console.log('loop complete'))
  .push(task1)
  .push(task2)
  .run();

/**
 * Expected output:
 * task 1 run, task 1 complete,
 * task 2 run, task 2 complete,
 * task 1 run, task 1 complete,
 * task 2 run, task 2 complete,
 * loop complete
 */
```

##### Simple tasks in a parallel
```javascript
const task1 = tf.task(
  2,
  () => console.log('task 1 run'),
  () => console.log('task 1 complete')
);
const task2 = tf.task(
  1,
  () => console.log('task 2 run'),
  () => console.log('task 2 complete')
);

tf.parallel(() => console.log('parallel complete'))
  .push(task1)
  .push(task2)
  .run();

/**
 * Expected output:
 * task 2 run, task 2 complete,
 * task 1 run, task 1 complete,
 * parallel complete
 */
```

##### Simple tasks in a limiter
```javascript
const task1 = tf.task(
  2,
  () => console.log('task 1 run'),
  () => console.log('task 1 complete')
);
const task2 = tf.task(
  1,
  () => console.log('task 2 run'),
  () => console.log('task 2 complete')
);

tf.limiter(1, () => console.log('limiter complete'))
  .push(task1)
  .push(task2)
  .run();

/**
 * Expected output:
 * task 1 run, task 1 complete,
 * task 2 run, task 2 complete,
 * limiter complete
 */
```

#### More examples

[Check out use.tasksf](http://github.com/ranapat/use.tasksf)

#### Documentation

[Check the documentation md](http://github.com/ranapat/tasksf/blob/master/docs/docs.md)

#### What is next

[Check the todo](http://github.com/ranapat/tasksf/blob/master/TODO.md)

#### What have changed

[Check the changelog](http://github.com/ranapat/tasksf/blob/master/CHANGELOG.md)
