import http from "../http_config"
import authHeader from "./auth_header";

class VibrationDataService {
    /*get(id) {
        return http.get(`/${id}`);
    }
    getbysensorid(id) {
        return http.get(`/sensorid/${id}`);
    }
    getbydaterange(data) {
        return http.post('/daterange', data);
    }*/
    getsensorbydaterange(data) {
        return http.post('/sensordata', data, {headers: authHeader()});
    }
    getsensoridlist() {
        return http.get('/sensordata/sensorids', {headers: authHeader()});
    }
    getclients() {
        return http.get('/clients', {headers: authHeader()});
    }
    getactiveclients() {
        return http.get('/clientsactive', {headers: authHeader()});
    }
    getlocations() {
        return http.get('/locations', {headers: authHeader()});
    }
    getactivelocations() {
        return http.get('/locationsactive', {headers: authHeader()});
    }
    getsensors() {
        return http.get('/sensors', {headers: authHeader()});
    }
    getsensorvalues() {
        return http.get('/sensor/sensorvalues', {headers: authHeader()});
    }
    getusers() {
        return http.get('/auths', {headers: authHeader()});
    }
    createuser(data) {
        return http.post('/register', data, {headers: authHeader()});
    }
    updateuser(id, data) {
        return http.put(`/auth/${id}`, data, {headers: authHeader()});
    }
    updateuserbyuser(id, data) {
        return http.put(`/auth/user/${id}`, data, {headers: authHeader()});
    }
    deleteuser(id) {
        return http.delete(`/auth/${id}`, {headers: authHeader()});
    }
    getUserById(id) {
        return http.get(`/auth/${id}`, {headers: authHeader()});
    }

    createlocation(data) {
        return http.post('/location', data, {headers: authHeader()});
    }
    updatelocation(id, data) {
        return http.put(`/location/${id}`, data, {headers: authHeader()});
    }
    deletelocation(id) {
        return http.delete(`/location/${id}`, {headers: authHeader()});
    }
    createclient(data) {
        return http.post('/client', data, {headers: authHeader()});
    }
  
    updateclient(id, data) {
        return http.put(`/client/${id}`, data, {headers: authHeader()});
    }
    deleteclient(id) {
        return http.delete(`/client/${id}`, {headers: authHeader()});
    }
    createsensor(data) {
        return http.post('/sensor', data, {headers: authHeader()});
    }
    updatesensor(id, data) {
        return http.put(`/sensor/${id}`, data, {headers: authHeader()});
    }
    deletesensor(id) {
        return http.delete(`/sensor/${id}`, {headers: authHeader()});
    }
    getSensorDetailsForDashboardMap () {
        return http.get(`/sensordata/fetchallsensor`,{ headers: authHeader()});
    
    }
    getSensorDetailsForDashboardMapByClient(){
        return http.get(`/sensordata/fetchalllocanddatabyclient`,{ headers: authHeader()});
     }

     getSensorWithoutUser(){
        return http.get(`/sensor/sensortoassignee`,{ headers: authHeader()});
     }
     assignSensorToUser(userId, sensorId){
        return http.put(`/sensor/${sensorId}/assignee
        `, { auth_id: userId },{ headers: authHeader()});
     }
}

export default new VibrationDataService();