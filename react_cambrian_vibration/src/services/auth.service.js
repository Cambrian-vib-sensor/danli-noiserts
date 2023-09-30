import http from "../http_config"

class AuthService {
    login (username, password) {
        return http.post("/login", {username, password})
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem('userInfo', JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem('userInfo');
    }

    register(/*username, password, role, client_id*/ data) {
        return http.post("/register", data);
    }
}

export default new AuthService();