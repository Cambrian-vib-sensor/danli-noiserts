import http from "../http_config"

class SLMDataService {
    getsensorbydaterange(data) {
        return http.post('/slmdata', data);
    }
    /*getsensoridlist() {
        return http.get('/sensordata/sensorids');
    }*/
}

export default new SLMDataService();