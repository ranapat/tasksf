# tasksf
Simple tasks manager factory

### Run your code based on tasks

#### Examples:

##### Simple tasks and sequences
```javascript
import { tf } from 'tasksf';

const task1 = tf.task(
  () => {
    console.log('task 1 run');
  },
  () => {
    console.log('task 1 complete');
  }
);
const task2 = tf.task(
  () => {
    console.log('task 2 run');
  },
  () => {
    console.log('task 2 complete');
  }
);

sequence.push(task1);
sequence.push(task2);

sequence.run();
```
