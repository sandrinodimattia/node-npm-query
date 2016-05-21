import async from 'async';
import EventEmitter from 'events';
import NpmClient from './NpmClient';

export default class NpmDownloadsQueue extends EventEmitter {
  constructor(concurrency = 1) {
    super();

    this.client = new NpmClient();

    this.queue = async.queue(this.getDownloads.bind(this), concurrency);
    this.queue.drain = () => this.emit('drain');
  }

  getDownloads(moduleId, callback) {
    this.client.getDownloads(moduleId)
      .then(downloads => {
        this.emit('data', moduleId, downloads);
      })
      .catch(err => {
        this.emit('error', err);
      })
      .finally(callback);
  }

  add(moduleId) {
    this.queue.push(moduleId, (err) => {
      if (err) {
        this.emit('error', err);
      }
    });
  }

  length() {
    return this.queue.length();
  }

  pause() {
    this.queue.pause();
  }

  resume() {
    this.queue.resume();
  }

  stop() {
    this.queue.kill();
  }
}
