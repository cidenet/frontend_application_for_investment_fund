import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Fund } from '../models/fund.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FundsService {

  // private apiUrlSubscriptionsBase = 'http://localhost:8000/subscriptions';
  // private apiUrlFundsBase = 'http://localhost:8000/funds';
  // private apiUrlUsersBase = 'http://localhost:8000/users';
  // private apiUrlSubscriptionsByUser = 'http://localhost:8000/subscriptions/user';
  // private apiUrlSubscriptionCancel = 'http://localhost:8000/subscriptions/cancel';

  private apiUrlSubscriptionsBase = environment.apiUrlSubscriptionsBase;
  private apiUrlFundsBase = environment.apiUrlFundsBase;
  private apiUrlUsersBase = environment.apiUrlUsersBase;
  private apiUrlSubscriptionsByUser = environment.apiUrlSubscriptionsByUser;
  private apiUrlSubscriptionCancel = environment.apiUrlSubscriptionCancel;


  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrlUsersBase);
  }

  getFunds(userId: string): Observable<Fund[]> {
    return this.getSubscriptionsByUserId(userId).pipe(
      switchMap(subscriptions =>
        this.http.get<Fund[]>(this.apiUrlFundsBase).pipe(
          map(funds => funds
            // Filtrar fondos con estado "active"
            .filter(fund => fund.status === 'active')
            .map(fund => {
              const subscription = subscriptions.find(subscription =>
                subscription.fund &&
                subscription.fund.id === fund.id &&
                subscription.status === 'active'
              );
              return {
                ...fund,
                user_is_subscribed: !!subscription,
                subscription_id_to_fund: subscription ? subscription.id : ''
              };
            })
          )
        )
      ),
      catchError(this.handleError)
    );
  }

  // transactions
  getSubscriptionsByUserId(userId: string): Observable<any[]> {
    const url = `${this.apiUrlSubscriptionsByUser}/${userId}`;
    return this.http.get<any[]>(url);
  }

  getTransactions(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlSubscriptionsBase}/${userId}/transactions`);
  }

  cancelSubscription(subscriptionId?: string) : Observable<any> {
    return this.http.post<void>(`${this.apiUrlSubscriptionCancel}/${subscriptionId}`, {});
  }

  createSubscription(subscriptionBody: any): Observable<any> {
    // return this.http.post<any>(`${this.apiUrlFundsBase}/${subscriptionBody.fundId}/subscribe`, subscriptionBody);
    return this.http.post(`${this.apiUrlSubscriptionsBase}`, subscriptionBody)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {

    console.log("error > 0> > ", error);

    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      console.log("error.error instanceof ErrorEvent")
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      console.log("!error.error instanceof ErrorEvent")
      errorMessage = error.error.detail;
    }
    console.log("error > 1> > ", errorMessage);
    return throwError(errorMessage);
    // return throwError(() => new Error(errorMessage));
  }
}
