import { tf } from '../../lib';

import Example from './examples/Example';
import Simple from './examples/Simple';
import Self from './examples/Self';
import Exceptions from './examples/Exceptions';
import Chaining from './examples/Chaining';
import Remap from './examples/Remap';
import Attach from './examples/Attach';
import TasksSharing from './examples/TasksSharing';
import Stopping from './examples/Stopping';
import Parallels from './examples/Parallels';
import Loops from './examples/Loops';
import Async from './examples/Async';

const sequence = tf.sequence(
  () => {
    console.log();
    console.log('--- all examples are complete');
  }
);
sequence.push(new Example());
sequence.push(new Simple());
sequence.push(new Self());
sequence.push(new Exceptions());
sequence.push(new Chaining());
sequence.push(new Remap());
sequence.push(new Attach());
sequence.push(new TasksSharing());
sequence.push(new Stopping());
sequence.push(new Parallels());
sequence.push(new Loops());
sequence.push(new Async());
sequence.run();
