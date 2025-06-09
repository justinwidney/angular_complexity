import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';



export interface ChartFilters {
    geoA: string;
    geoB: string;
    survey: string;
    display: boolean;
    dropdowns?: string[];
    accordions?: string[];
  }
  
export interface ChartData {
    Charactersitic: string;
    "Business or organization information": string;
    "Expected change over the next three months"    : string;
    "Value": number;
    "QtrDate": string;
    "Date": string;
    "GeoID": string;
    "GeoName": string;
    "NAICS": string;
}



@Injectable({
  providedIn: 'root',
})

export class ChartSignalService {


    private _initialized = signal<boolean>(false);
    private _filters = signal<ChartFilters>({
            geoA: 'Alberta',
            geoB: 'None',
            survey: 'Number of employees',
            display: false,
    });

    private _chartData = signal<ChartData | null>(null);
    private _loading = signal<boolean>(false);

    readonly initialized = this._initialized.asReadonly();
    readonly filters = this._filters.asReadonly();

    constructor(private http: HttpClient) { 


    }

      // Initialize the service and fetch initial data
  initialize() {
    if (!this._initialized()) {
      this.fetchData();
      this._initialized.set(true);
    }
    return this._chartData;
  }

  




    setDropdownA(value: string) {
        this._filters.update(current => ({ ...current, geoA: value }));
    }

    setDropdownB(value: string) {
        this._filters.update(current => ({ ...current, geoB: value }));
    }

    setSurvey(value: string) {
        this._filters.update(current => ({ ...current, survey: value }));
    }

    setDisplay(value: boolean) {
        this._filters.update(current => ({ ...current, display: value }));

    }

    getGeoA() {
        return this._filters().geoA;
    }
    getGeoB() {
        return this._filters().geoB;
    }
    getSurvey() {
        return this._filters().survey;
    }
    getDisplay() {
        return this._filters().display;
    }


     // Method to fetch data based on current filters
  private fetchData() {
    this._loading.set(true);
    
    // Example API call (replace with your actual data fetching logic)
    this.http.get<ChartData>(`https://api.economicdata.alberta.ca/api/data?code=19bea977-be6f-47d3-82a0-4304560c60fa`, {}
    ).pipe(
      tap(data => {
        this._chartData.set(data);
        this._loading.set(false);
      })
    ).subscribe();
  }

}