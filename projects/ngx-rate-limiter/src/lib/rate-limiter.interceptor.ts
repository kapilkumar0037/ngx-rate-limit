import { Injectable, InjectionToken, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export const RATE_LIMIT_CONFIG = new InjectionToken<RateLimitConfig>('RATE_LIMIT_CONFIG');

export interface RateLimitProperties {
  maxRequests: number;
  intervalDuration: number;
  blockDuration: number;
}
export interface SpecificEndPointConfig {
  urlEndsWith: string;
  config: RateLimitProperties;
}

export interface RateLimitConfig {
  allEndPointsConfig?: RateLimitProperties;
  specificEndPointsConfig?: SpecificEndPointConfig[];
}

@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {
  private globalConfig: RateLimitProperties | undefined;
  private specificEndPointConfigs?: SpecificEndPointConfig[];
  private requestCounts: { [url: string]: { count: number; lastUpdated: number; blockedUntil: number } } = {};

  constructor(@Inject(RATE_LIMIT_CONFIG) private consumerConfig: RateLimitConfig) {    
      this.globalConfig = consumerConfig.allEndPointsConfig;    
    this.specificEndPointConfigs = consumerConfig?.specificEndPointsConfig;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url;
    const now = Date.now();
    let config: RateLimitProperties | undefined = this.globalConfig;

    if (this.specificEndPointConfigs) {
      const matchedConfig = this.specificEndPointConfigs.find(specConfig =>
        url.endsWith(specConfig.urlEndsWith)
      );

      if (matchedConfig) {
        config = matchedConfig.config;
      }
    }

    // Initialize request count if not exists or reset if last updated more than configured interval duration
    if (!this.requestCounts[url] || (config && now - this.requestCounts[url].lastUpdated > config.intervalDuration)) {
      this.requestCounts[url] = { count: 0, lastUpdated: now, blockedUntil: 0 };
    }

    // Check if the endpoint is blocked
    if (this.requestCounts[url].blockedUntil > now) {
      return throwError(() => new HttpErrorResponse({ status: 429, error: { message: 'Rate limit exceeded' } }))
    }

    // Increment request count
    this.requestCounts[url].count++;

    // Check if request count exceeds the limit
    if (config && this.requestCounts[url].count > config.maxRequests) {
      // Block the endpoint for the configured block duration
      this.requestCounts[url].blockedUntil = now + config.blockDuration;
      return throwError(() => new HttpErrorResponse({ status: 429, error: { message: 'Rate limit exceeded' } }));

    }

    // Proceed with the request if within the limit
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Update last updated time for the endpoint
          this.requestCounts[url].lastUpdated = Date.now();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Decrement request count on error response
        if (error.status !== 429) {
          this.requestCounts[url].count--;
        }
        return throwError(error);
      })
    );
  }
}
