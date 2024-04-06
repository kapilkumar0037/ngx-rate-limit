import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  GLOBAL_RATE_LIMIT_CONFIG,
  SPECIFIC_ENDPOINT_RATE_LIMIT_CONFIG,
} from './constants/constants';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { RATE_LIMIT_CONFIG, RateLimitInterceptor } from 'ngx-rate-limiter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: RateLimitInterceptor, multi: true },
    {
      provide: RATE_LIMIT_CONFIG,
      useValue: {
        specificEndPointsConfig: SPECIFIC_ENDPOINT_RATE_LIMIT_CONFIG,
        allEndPointsConfig: GLOBAL_RATE_LIMIT_CONFIG,
      },
    },
  ],
};
