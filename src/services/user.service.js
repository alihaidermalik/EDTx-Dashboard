import axios from "axios/index";

export const userService = {
    login,
    logout,
    getUsername,
};

function login(username, password) {
    return axios.post(process.env.REACT_APP_API_URL + "/api/auth/edtxlogin",
        {
            "username": username,
            "password": password,
        })
        .then(res => {
            return res.data;
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.access_token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            }
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('username');
}

function getUsername() {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.get(process.env.REACT_APP_API_URL + "/api/auth/username",
        {headers: {"X-Authorization": "Token " + user.access_token}})
        .then(response => {
            localStorage.setItem('username', response.data.username);
            return response.data.username
        });
}