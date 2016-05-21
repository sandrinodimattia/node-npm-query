import follow from 'follow';
import EventEmitter from 'events';

export default class NpmModuleStream extends EventEmitter {
  constructor(lastSequence = 0) {
    super();

    this.feed = new follow.Feed({
      db: 'https://skimdb.npmjs.com/registry/',
      include_docs: true,
      since: lastSequence < 0 ? 0 : lastSequence
    });
    this.feed.on('change', (change) => this.emit('data', change));
    this.feed.on('error', (err) => this.emit('error', err));
  }

  start() {
    this.feed.follow();
  }

  pause() {
    this.feed.pause();
  }

  resume() {
    this.feed.resume();
  }

  stop() {
    this.feed.stop();
  }
}
