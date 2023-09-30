import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL

const http_conn = axios.create({
    baseURL: baseURL
});


http_conn.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      const { data, status } = error.response
      switch (status) {
        case 400:
          console.error(data)
          break
        case 403:
        case 401: {
          console.error("unauthorised")
          localStorage.removeItem("userInfo")
          window.location.reload()
          break
        }
  
        case 404:
          console.error("/not-found")
          break
  
        case 500:
          console.error("/server-error")
          break
          default: {}
      }
      return Promise.reject(error)
    },
  )
  

export default http_conn;
