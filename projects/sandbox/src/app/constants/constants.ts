import { RateLimitProperties, SpecificEndPointConfig } from '../../../../ngx-rate-limiter'
export const SPECIFIC_ENDPOINT_RATE_LIMIT_CONFIG: SpecificEndPointConfig[] = [
    { urlEndsWith: '/launches', config: { maxRequests: 5, blockDuration: 5000, intervalDuration: 10000 } }
]
export const GLOBAL_RATE_LIMIT_CONFIG: RateLimitProperties = {
    maxRequests: 5,
    intervalDuration: 10000,
    blockDuration: 5000
} 