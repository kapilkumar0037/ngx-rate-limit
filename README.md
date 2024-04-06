# NGX Rate Limiter

This library provides an interceptor for Angular applications that allows you to implement rate limiting for HTTP requests made by your application. This interceptor helps prevent excessive traffic to your server by restricting the number of requests that can be made within a certain time interval. This can provide an extra layer of security and can be very impactful in today's world where creating bots becomes very easy and 100s of requests can be made within seconds.

## Features

- **Global Rate Limiting**: Set a global rate limit for all HTTP requests made by your Angular application.
- **Specific Endpoint Configuration**: Define specific rate limits for individual API endpoints based on the endpoint ending with.
- **Dynamic Configuration**: Easily configure rate limits by providing a configuration object to the interceptor.
- **Exceeding Rate Limit Handling**: Automatically block requests that exceed the configured rate limit for sepcific time. Once an endpoint exceeds the limit specified requests from that endpoint can be blocked for a specific amount of time . The interceptor return a status code 429 with message "Too Many Requests".

## Getting started

Hope you already have an angular project, if not please create one using the below commands

```
npm install -g @angular/cli
ng new my-app
cd my-app
ng serve --open
```

once the angular application setup is ready, install the Ngx Rate Limiter using the following command

```
npm i ngx-rate-limiter
```


### Use the interceptor

Add the interceptor to `app.config` or `app.module.ts` depends on what Angular version consuming application has.
```
  { provide: HTTP_INTERCEPTORS, useClass: RateLimitInterceptor, multi: true },
```
### Provide RATE_LIMIT_CONFIG
```
{
      provide: RATE_LIMIT_CONFIG,
      useValue: {
        specificEndPointsConfig: SPECIFIC_ENDPOINT_RATE_LIMIT_CONFIG,
        allEndPointsConfig: GLOBAL_RATE_LIMIT_CONFIG,
      },
    },
```
**Config**
```
export const SPECIFIC_ENDPOINT_RATE_LIMIT_CONFIG: SpecificEndPointConfig[] = [
  {
    urlEndsWith: '/launches',
    config: {
      maxRequests: 10,
      blockDuration: 10000,
      intervalDuration: 60000,
    },
  },
];
export const GLOBAL_RATE_LIMIT_CONFIG: RateLimitProperties = {
  maxRequests: 5,
  intervalDuration: 10000,
  blockDuration: 5000,
};
```

that's it.
If `allEndPointsConfig` config not provided, Rate limiter will only rate limit the specific endpoint. If both are provided then all endpoints config will work for all endpoints except the ones defined in specific endpoint config.

So with the above provided config, if user makes more than 10 requests with a minute with endpoint ending with '/launches', the rate limiter will block all request for next 10 seconds.
