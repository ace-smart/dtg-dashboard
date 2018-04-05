/**
 * Created by jayhamilton on 6/24/17.
 */

import {Injectable} from '@angular/core';
import {RuntimeService} from '../../services/runtime.service';
import {TrendLineService} from '../trend-line/service';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class DonutService {

    constructor(private _http: HttpClient) {
    }

    get() {
        return this._http.get('/assets/api/donut-model.json')
            .catch(RuntimeService.handleError);
    }

    getHelpTopic() {

        return this._http.get('/assets/api/disk-help-model.json')
            .catch(RuntimeService.handleError);
    }

    poll() {
        return new Observable(observer => {
            Observable.timer(500, 10000).subscribe(t => {
                observer.next();
            });
        });
    }

    complianceJob(event: string) {

        /**
         *         post a request to the backend to start a compliance operation. The get API above will reflect the
         *         changing results of the compliance job. The compliance job will have an event action that dictates
         *         state transitions stop, start, pause, abort, status.
         */

    }
}
