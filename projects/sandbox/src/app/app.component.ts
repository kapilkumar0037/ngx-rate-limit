import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sandbox';
  apiService = inject(ApiService);
  spacexApiError = '';
  countriesApiError = '';

  fetchSpacexData() {
    this.clearError();
    this.apiService.getLaunchesData({}).subscribe({
      next: (data) => {},
      error:(err)=> {
        console.log(err);
        this.spacexApiError = err?.error?.message
      },
    })
  }

  getCountries(){
    this.clearError();
    this.apiService.getCountries().subscribe({
      next: (data) => {},
      error: (err)=> {
        console.log(err);
        this.countriesApiError = err?.error?.message

      },
    })
  }

  clearError(){
    this.spacexApiError = '';
    this.countriesApiError = '';
  }
}
