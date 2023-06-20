import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})

/**
 * Navigation bar used to route between movie page, profile page,
 * and gives option to logout
 */
export class NavigationBarComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Navigates to movies page
   */
  toMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Navigates to profile page
   */
  toProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs out user from page
   */
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
