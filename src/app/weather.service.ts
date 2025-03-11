import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WeatherForecast {
  date: Date;
  condition: WeatherCondition;
  precipitation: number;
  cloudCover: number;
  temperatureMax: number;
  temperatureMin: number;
}

export enum WeatherCondition {
  SUNNY = 'soleggiato',
  PARTLY_CLOUDY = 'soleggiato con nuvole',
  CLOUDY = 'nuvoloso',
  RAIN = 'pioggia',
  THUNDERSTORM = 'temporale'
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) { }

  getDetailedForecast(latitude: number, longitude: number): Observable<WeatherForecast[]> {
    // Costruzione dell'URL con i parametri necessari per determinare le diverse condizioni meteo
    const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&daily=precipitation_sum,precipitation_probability_max,cloud_cover_mean,weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=16`;

    return this.http.get<any>(url).pipe(
      map(response => {
        const forecasts: WeatherForecast[] = [];
        
        // Processiamo i dati giornalieri
        if (response.daily) {
          console.log('dati arrivati da open meteo:',response);
          const dates = response.daily.time;
          const precipitationSum = response.daily.precipitation_sum;
          const precipitationProb = response.daily.precipitation_probability_max;
          const cloudCover = response.daily.cloud_cover_mean;
          const weatherCode = response.daily.weathercode;
          const tempMax = response.daily.temperature_2m_max;
          const tempMin = response.daily.temperature_2m_min;
          
          for (let i = 0; i < dates.length; i++) {
            forecasts.push({
              date: new Date(dates[i]),
              condition: this.determineWeatherCondition(
                weatherCode[i], 
                precipitationSum[i], 
                precipitationProb[i], 
                cloudCover[i]
              ),
              precipitation: precipitationSum[i],
              cloudCover: cloudCover[i],
              temperatureMax: tempMax[i],
              temperatureMin: tempMin[i]
            });
          }
        }
        
        return forecasts;
      })
    );
  }

  private determineWeatherCondition(
    weatherCode: number, 
    precipitationSum: number, 
    precipitationProb: number, 
    cloudCover: number
  ): WeatherCondition {
    // Utilizziamo una combinazione di weathercode e altri parametri per determinare la condizione
    
    // Temporale - Codici WMO per temporali
    if ([95, 96, 97, 98, 99].includes(weatherCode)) {
      return WeatherCondition.THUNDERSTORM;
    }
    
    // Pioggia - Codici WMO per pioggia o se c'è una quantità significativa di precipitazioni
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode) || 
        precipitationSum > 0.5 || 
        precipitationProb > 50) {
      return WeatherCondition.RAIN;
    }
    
    // Nuvoloso - Copertura nuvolosa elevata
    if (cloudCover > 70) {
      return WeatherCondition.CLOUDY;
    }
    
    // Parzialmente nuvoloso - Copertura nuvolosa moderata
    if (cloudCover > 30) {
      return WeatherCondition.PARTLY_CLOUDY;
    }
    
    // Soleggiato - Bassa copertura nuvolosa
    return WeatherCondition.SUNNY;
  }
}