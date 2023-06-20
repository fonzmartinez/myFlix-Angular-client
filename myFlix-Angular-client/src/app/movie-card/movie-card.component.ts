import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MovieGenreComponent } from '../movie-genre/movie-genre.component';
import { DirectorComponent } from '../director/director.component';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  // favorites: any[] = [];
  constructor(public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMovies();
    //  this.getFavorites();
  }

  /**
   * Get all movies with FetchApiDataService.getAllMovies()
   * @returns all movies 
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Opens the genre dialog showing genre info
   * @param name - genre's name to show on the dialog 
   * @param description - genre's description to show on the dialog
   */
  openGenre(name: string, description: string): void {
    this.dialog.open(MovieGenreComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: '400px'
    });
  }

  /** 
   * Opens the director dialog showing director info
    * @param name - director's name to show on the dialog 
    * @param bio - director's bio to show on the dialog
    */
  openDirector(name: string, bio: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio
      },
      width: '400px'
    });
  }

  /**
   * Opens the Movie Details dialog showing title and synopsis.
   * @param title - title name showing movie title
   * @param description - description showing synopsis of movie
   */
  openSynopsis(title: string, description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '400px',
    });
  }

  /**
   * Calls the add favorite movie method on the API.
   * @param id - movie ID
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {

      this.snackBar.open('Movie added to favorites.', 'OK', {
        duration: 2000
      });
    });
  }

  /**
 * Calls the check favorite movie method on the API.
 * @param id - movie ID
 */
  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id);
  }

  /**
 * Calls the delete favorite movie method on the API.
 * @param id - movie ID
 */
  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites.', 'OK', {
        duration: 2000
      });
    });
  }
}
