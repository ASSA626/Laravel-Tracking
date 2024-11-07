import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
        Echo: any,
        Pusher: any
    }

    var route: typeof ziggyRoute;
}
