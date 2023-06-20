import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the API URl that provides data for the client app
const apiUrl = 'https://enigmatic-eyrie-99477.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  /**
  * Making the api call for the user registration endpoint
  * @param userDetails - user credentials
  * @returns http POST request endpoint .../users 
  */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
    * Making the api call for the User login endpoint.
    * @param userDetails - user credentials
    * @returns http POST request endpoint .../login
    */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Making the api call for Get all movies endpoint
  * @returns http GET request endpoint .../movies
  */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Making the api call for the Get one movie endpoint.
 * @param title - movie title
 * @returns http GET request endpoint .../movies/(title)
 */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
  * Making the api call for the Get director endpoint.
  * @param directorName - director name
  * @returns http GET request endpoint .../movies/director/(directorname)
  */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /** 
    * Making the api call for the Get genre endpoint.
    * @param genreName - genre name
    * @returns http GET request endpoint ../movies/genre/(genreName)
    */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /** 
    * Making the api call for the Get user endpoint.
    * @returns http GET request endpoint ../users/(user.Username)
    */
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  /**
  * Making the api call for the Get favorite movies for an user endpoint.
  * @returns http GET request endpoint .../users/(user.Username)
  */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**
  * Making the api call for the Add movie to favorites endpoint.
  * @param movieId - movie Id
  * @returns http POST request enpoint .../users/(user.Username)/movies/(movieId)
  */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Checks to see if movie is already in favorites list
   * @param movieId - movie Id
   */
  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  /**
* Making the api call for the Edit user endpoint.
* @param updatedUser - updated user 
* @returns http PUT request ednpoint .../users/(user.Username)
*/
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Making the api call for the Delete user endpoint.
 * @returns http DELETE request endpoint .../users/(user.Username)
 */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Making the api call for the Delete a movie from favorites endpoint
  * @param movieId - movie Id
  * @returns http DELETE request endpoint .../users/(user.Username)/movies/(movieId)
  */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const index = user.FavoriteMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) {
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }


  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}



/*
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor() { }
}
*/
