import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { User } from '../models';
import { apiURL } from '../app.config';

// save/pull user in/from localstorage
const STORAGE_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })

export class AuthService {

    // get the session user
    currentUser = signal<User | null>(this.loadStoredUser());

    // add http client to class
    constructor(private http: HttpClient) { }

    // load User method
    private loadStoredUser(): User | null {

        // get user data from storage if exists
        const userRaw = localStorage.getItem(STORAGE_KEY);
        // no user -> observable closes
        if (!userRaw) return null;

        // parse stored json into object
        try {
            const userParsed: User = JSON.parse(userRaw);
            return userParsed; // load parsed user to session observable
        } catch {
            return null; // load null, observable closes
        }
    }

    // login method returns an instance of observable User or null if there isnt any
    login(username: string, password: string): Observable<User | null> {

        // makes a POST http request to the server == ASYNC, since I dont want to process promises to observable, im gonna be using pipe as a side effect 

        //return value is 
        return this.http
            .post<User>(`${apiURL}/auth/login`, { username, password })
            // pipeline on response
            .pipe(
                // take data from pipeline (not affecting the response data flowing to other pipe methods)
                tap(user => {
                    // set the returned data into the user signal == stored the user inside stateful object through session lifetime.
                    this.currentUser.set(user);
                    // save current state into localstorage to persist session with page refreshes.
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                }),
                // on any any error, callback returns null, observable is set to null and emits null to subscribers and closes (unsuccessful login attempt or any other error)
                catchError(() => of(null))
            );
    }

    //logout method to close user signal and clear session from storage
    logout(): void {
        // signal is set to null => closes 
        this.currentUser.set(null);
        // delete stored session from browser memory. (i better use session storage - its supposed to do that automatically)
        localStorage.removeItem(STORAGE_KEY);
    }



    /* 
    // Breakdown of what login() above simplifies making a request stream to (ignore this, it's my sanity check)
    
    login_explained(username: string, password: string): Observable<User | null> {
        
        const saveSession = (a: User): void => {return}; // explicit callback definition
        const handleLoginError = (): Observable<null> => { return of(null) }; // explicit callback definition

        // 1. prepate request data, sync
        const loginUrl = `${apiURL}/auth/login`;

        // 2. create a raw http stream, not sent yet
        const httpRequest$: Observable<User> = this.http.post<User>(loginUrl,{username, password});
        
        // 3. create a side effect, on success, not sent yet
        const requestWithSaveSession$ = httpRequest$.pipe(
            tap((userFromServer: User) => {
                saveSession(userFromServer);
            }),
        );

        // 4. create a side effect on error, not sent yet
        const loginStream$: Observable<User | null> = requestWithSaveSession$.pipe(
            catchError(() => handleLoginError()),
        );

        // 5. return ready stream
        // login exits, http request stream will only execute in .subscribe()
        return loginStream$;
    }
    */
}