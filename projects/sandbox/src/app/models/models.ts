export interface ApiFilter {
    year?: string;
    launchSuccess?: string;
    landingSuccess?: string;
}

export interface LaunchData {
    flight_number?: number;
    mission_name?: string;
    mission_id?: string[];
    launch_year?: string;
    mission_patch_small?: string;
    launch_success?: string;
    land_success?: boolean;
    links?:any;
    rocket?:any;
}