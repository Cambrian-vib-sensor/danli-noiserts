export default function authHeader() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.accessToken) {
        //return {Authorization: 'Bearer ' + userInfo.accessToken};
        return { 'x-access-token': userInfo.accessToken };
    }
    return {};
}