import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
            private processHTTPMsgService: ProcessHTTPMsgService) { }
    
    submitFeedback(feedback: Feedback): Observable<Feedback> {
        
        return this.http.post<Feedback>(baseURL + 'feedback', feedback).pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
