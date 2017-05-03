# tasksf
Simple tasks manager factory

### Run your code based on tasks

#### Examples:

##### Simple tasks and sequences
```javascript
import { tf } from 'tasksf';

const task1 = tf.task(
  () => console.log('task 1 run')
);
const task2 = tf.task(
  () => console.log('task 2 run')
);

tf.sequence().push(task1).push(task2).run();
```

#### More examples

[Check out use.tasksf](http://github.com/ranapat/use.tasksf)