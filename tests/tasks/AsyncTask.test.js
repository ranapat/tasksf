import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import { AsyncTask } from '../../src';

describe('Test AsyncTask', () => {
  chai.use(chai_spies);

  it('to be starting and waiting', () => {
    const task = new AsyncTask();
    task.run();
    expect(task.running).to.equal(true);
    expect(task.done).to.equal(false);
    task.complete();
    expect(task.done).to.equal(true);
  });

  it('to be running and completing', () => {
    const run = chai.spy(() => {});
    const complete = chai.spy(() => {});
    const task = new AsyncTask(run, complete);
    task.run();
    expect(task.running).to.equal(true);
    expect(task.done).to.equal(false);
    expect(run).to.have.been.called();
    expect(complete).not.to.have.been.called();
    task.complete();
    expect(task.done).to.equal(true);
    expect(run).to.have.been.called();
    expect(complete).to.have.been.called();
  });

  it('to give proper parameters to run and complete (1)', (done) => {
    const run = chai.spy(
      (_complete, self) => {
        expect(self).to.equal(task);
        expect(self.complete).not.to.equal(_complete);
        expect(typeof _complete).to.equal('function');
        _complete();
        expect(complete).to.have.been.called();
        done();
      }
    );
    const complete = chai.spy();
    const task = new AsyncTask(run, complete);
    task.run();
  });

  it('to give proper parameters to run and complete (2)', (done) => {
    const run = chai.spy(
      (_complete, self) => {
        expect(self).to.equal(task);
        expect(self.complete).not.to.equal(_complete);
        expect(typeof _complete).to.equal('function');
        self.complete();
        expect(complete).to.have.been.called();
        done();
      }
    );
    const complete = chai.spy();
    const task = new AsyncTask(run, complete);
    task.run();
  });

  it('to give proper parameters to run and complete (3)', (done) => {
    const run = chai.spy(
      (_complete, self) => {
        expect(self).to.equal(task);
        expect(self.complete).not.to.equal(_complete);
        expect(typeof _complete).to.equal('function');
        _complete.apply(self);
        expect(complete).to.have.been.called();
        done();
      }
    );
    const complete = chai.spy();
    const task = new AsyncTask(run, complete);
    task.run();
  });

  it('to accept parameters in run', (done) => {
    const run = chai.spy(
      (_complete, self, ...args) => {
        expect(args.length).to.equal(2);
        expect(args[0]).to.equal('a');
        expect(args[1]).to.equal(1);
        done();
      }
    );
    const complete = chai.spy();
    const task = new AsyncTask(run, complete);
    task.run('a', 1);
  });

});
