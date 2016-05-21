# node-npm-query

The `npm-query` library allows you to query modules from the NPM registry, get module details and download statistics.

> npm install --save npm-query

## Usage

### Query Modules

#### Get Module

The module contains all of the data including versions, contributors, the `package.json` file for every release, ...

```js
import { NpmClient } from 'npm-query';

const npmClient = new NpmClient();

// Get the bluebird module.
npmClient.getModule('bluebird')
  .then(module => {
    console.log({
      name: module.name,
      description: module.description,
      keywords: module.keywords,
      bugs: module.bugs
    });
  })
  .catch(err => {
    console.log('Error fetching module:', err);
  });
```

#### Get Modules Stream

The library allows you to get all modules since a certain point (a sequence).

```js
import { NpmClient } from 'npm-query';

const npmClient = new NpmClient();

// Get all modules since a certain point (you can retrieve the sequence from the modules).
const lastSequence = 1000000;

// Create a stream and listen of modules.
const stream = npmClient.getModuleStream(lastSequence);
stream.on('data', (module) => {
  console.log({
    name: module.name,
    description: module.description,
    keywords: module.keywords,
    bugs: module.bugs,
    sequence: module.seq
  });
});
stream.on('error', (err) => {
  console.log('Error in module stream:', err);
});

// Start the stream. You can call pause/resume/stop
stream.start();
```

### Downloads

#### Downloads for a single module

You can get the statistics for the `last-day`, `last-week` and `last-month`.

```js
// Get the downloads for a single period.
npmClient.getDownloadsForPeriod('bluebird', 'last-day')
  .then(downloads => {
    console.log(downloads);
  })
  .catch(err => {
    console.log('Error fetching downloads:', err);
  });
```

Returns:

```json
{
  "downloads": "351701",
  "start": "2016-05-20",
  "end": "2016-05-20",
  "package": "bluebird"
}
```

You can also get the statistics for all periods:

```js
// Get the downloads for all periods.
npmClient.getDownloads('bluebird')
  .then(downloads => {
    console.log(downloads);
  })
  .catch(err => {
    console.log('Error fetching downloads:', err);
  });
```

Returns:

```json
{
  "last_day": "351701",
  "last_week": "2057550",
  "last_month": "7966475"
}
```

#### Collect download statistics in bulk

```js
import { NpmDownloadsQueue } from 'npm-query';

// Initialize the queue.
const queue = new NpmDownloadsQueue();
queue.on('error', (err) => {
  console.log('Error fetching downloads:', err);
});
queue.on('data', (moduleId, downloads) => {
  console.log(moduleId, downloads);
});

// Add modules for which you want download statistics.
queue.add('bluebird');
queue.add('jquery');

// You can inspect the current queue length.
console.log(queue.length());

// You can also control the queue
queue.pause();
queue.resume();
queue.stop();
```

Returns:

```js
bluebird { last_day: 351701, last_week: 2057550, last_month: 7966475 }
jquery { last_day: 86723, last_week: 448441, last_month: 1882966 }
```
