import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
            private processHTTPMsgService: ProcessHTTPMsgService) { }
    
    getPromotions(): Observable<Promotion[]>{
        return this.http.get<Promotion[]>(baseURL + 'promotions').pipe(catchError(this.processHTTPMsgService.handleError));
    }
    
    getPromotion(id: string): Observable<Promotion> {
        return this.http.get<Promotion>(baseURL + 'promotion/' + id).pipe(catchError(this.processHTTPMsgService.handleError));
    }
    
    getFeaturedPromotion(): Observable<Promotion>{
        return  this.http.get<Promotion[]>(baseURL + 'promotions?featured=true').pipe(map(Promotions => Promotions[0])).pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
