# tasksf [![npm version](https://img.shields.io/npm/v/tasksf.svg?style=flat)](https://www.npmjs.com/package/tasksf) [![Build Status](https://img.shields.io/travis/ranapat/tasksf/master.svg?style=flat)](https://travis-ci.org/ranapat/tasksf) [![Coverage Status](https://coveralls.io/repos/ranapat/tasksf/badge.svg?branch=master)](https://coveralls.io/r/ranapat/tasksf?branch=master)
Simple tasks manager factory

### Run your code based on tasks

Run callback tasks, timeout tasks, trigger tasks and async tasks in sequences, loops, parallels and limiters with automatic exception handling.
Provides easier way to handle chaining and unchainig of events and actions.

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

##### Creating a task

Task is a set of run, complete and recover callbacks.
On task.run() we have run callback executed.
When it's complete we have the complete callback executed.
Recover is used in case you put your tasks in some collection
and the previous task crashes with exceptions. You will
receive that exception and define if you want to proceed / run
or stop.

```javascript
// default way
new Task(run, complete, recover)
// quick way
tf.task(run, complete, recover)
// you can skip complete or/and recover
new Task(run)
tf.task(run)
```

##### Creating a timeout task

Timeout task is a task that runs after timeout. The timeout
is in ms. So 5 * 1000 will run after 5 sec.

```javascript
// default way
new TimeoutTask(timeout, run, complete, recover)
// quick way
tf.task(timeout, run, complete, recover)
// you can skip run, complete or/and recover
new TimeoutTask(timeout)
tf.task(timeout)
```

##### Creating a trigger task

Trigger task is a task that never runs alone. It's useful
when waiting for something - event, something else, user interaction.
It has no run or recover method - and when put in a queue it just waits
for complete().

```javascript
// default way
new TriggerTask(complete)
// quick way
tf.task(complete, false)
// you can skip complete
new TriggerTask()
tf.task()
```

##### Creating a async task

Async task is similar to Trigger task, but with
run and complete body. Run will execute run callback, but
never run complete alone - you need to trigger it yourself.
You receive "completeMe" as a first parameter.

```javascript
const run = (completeMe, self, ...) => {
  // do something
  completeMe() // will call complete callback and proceed
};
new AsyncTask(run);
// or
new AsyncTask((complete) => { complete(); });
// or
tf.task((complete) => { complete(); }, 0);
```

```javascript
// default way
new AsyncTask(run, complete, recover)
// quick way
tf.task(run, complete, recover, 0)
// you can skip complete or/and recover
new AsyncTask(run)
tf.task(run, 0)
```

##### Tasks in a sequence

Sequence executes tasks one by one.

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

##### Tasks in a loop

Loop is sequence that repeats

```javascript
const task1 = tf.task(
  () => console.log('task 1 run'),
  () => console.log('task 1 complete')
);
const task2 = tf.task(
  () => console.log('task 2 run'),
  () => console.log('task 2 complete')
);

tf.loop(2, () => console.log('loop'))
  .push(task1)
  .push(task2)
  .run();

/**
 * Expected output:
 * task 1 run, task 1 complete,
 * task 2 run, task 2 complete,
 * loop
 * task 1 run, task 1 complete,
 * task 2 run, task 2 complete,
 * loop
 */
```

##### Timeout tasks in a parallel

Parallel runs all at once. You can have complete callback
on the first or on the last of tasks.

```javascript
const task1 = tf.task(
  200,
  () => console.log('task 1 run'),
  () => console.log('task 1 complete')
);
const task2 = tf.task(
  100,
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

##### Timeout tasks in a limiter

Limiter is a parallel with limit of currently running tasks.
Default limit is 1.

```javascript
const task1 = tf.task(
  200,
  () => console.log('task 1 run'),
  () => console.log('task 1 complete')
);
const task2 = tf.task(
  100,
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

[Check the examples](http://github.com/ranapat/tasksf/blob/master/examples/src)

#### Documentation

[Check the documentation](http://github.com/ranapat/tasksf/blob/master/docs/docs.md)

#### What is next

[Check the todo](http://github.com/ranapat/tasksf/blob/master/TODO.md)

#### What have changed

[Check the changelog](http://github.com/ranapat/tasksf/blob/master/CHANGELOG.md)
