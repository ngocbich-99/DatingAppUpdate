import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userInfo } from 'os';
import { ReplaySubject } from 'rxjs';
import { map} from 'rxjs/operators';
import { User } from '../_models/user';

// This means that this service can be injected into 
// other components or other services in our application.
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // This is going to be used to make requests to our API.
  baseUrl = "https://localhost:5001/api/";
  private currentUserSource = new ReplaySubject<User>(1);
  currentUsers$ = this.currentUserSource.asObservable();


  constructor(private http: HttpClient) { }

  // This is going to contain our 
  // username and password that we send up to the server.
  login(model: any){
    return this.http.post(this.baseUrl + 'account/login',model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model: any){
    return this.http.post(this.baseUrl + 'account/register',model).pipe(
      map((user: User) => {
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        // return user;
      })
    )
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}