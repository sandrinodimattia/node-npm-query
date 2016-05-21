import Promise from 'bluebird';
import request from 'request-promise';
import { globalAgent } from 'https';

import NpmModuleStream from './NpmModuleStream';

export default class NpmClient {
  getModule(moduleId) {
    return request.get({ url: `https://registry.npmjs.org/${moduleId}`, json: true, agent: globalAgent });
  }

  getDownloadsForPeriod(moduleId, period) {
    return request.get({ url: `https://api.npmjs.org/downloads/point/${period}/${moduleId}`, json: true, agent: globalAgent });
  }

  getDownloads(moduleId) {
    return Promise.all([ 'last-day', 'last-week', 'last-month' ].map(period => this.getDownloadsForPeriod(moduleId, period)))
      .then(([ lastDay, lastWeek, lastMonth ]) => {
        return {
          last_day: lastDay.error ? 0 : lastDay.downloads,
          last_week: lastWeek.error ? 0 : lastWeek.downloads,
          last_month: lastMonth.error ? 0 : lastMonth.downloads
        };
      });
  }

  getModuleStream(lastSequence = 0) {
    return new NpmModuleStream(lastSequence);
  }
}
