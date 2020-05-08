import axios from "axios/index";

export const messageService = {   
    getMessages, 
    getContacts,
    getLastContact,
    getCountMessages,
    postMessage,
    deleteMessage,
    postMessageMulti
};

function getMessages(username , page = 1, page_size=10){
    let user = JSON.parse(localStorage.getItem('user'));    
    let params = {   
        page: page,
        page_size: page_size     
    } 
    
    return axios.get(process.env.REACT_APP_API_URL + "/api/notifications/messages/" + username,
        {
            params: params,
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            return response.data;
        })
}
function getContacts(page = 1, page_size=10){
    let user = JSON.parse(localStorage.getItem('user'));  
    let params = {   
        page: page,
        page_size: page_size     
    }      
    return axios.get(process.env.REACT_APP_API_URL + "/api/notifications/contacts",
        {
            params: params,
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {            
            return response.data;
        })
}
function getLastContact(){
    let user = JSON.parse(localStorage.getItem('user'));    
    return axios.get(process.env.REACT_APP_API_URL + "/api/notifications/last_contact",
        {           
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {            
            return response.data;
        })
}
function getCountMessages(){
    let user = JSON.parse(localStorage.getItem('user'));    
    // console.log("token", user["access_token"])
    return axios.get(process.env.REACT_APP_API_URL + "/api/notifications/count_messages",
        {           
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {            
            return response.data;
        })
}
function postMessage(messageData){
    let user = JSON.parse(localStorage.getItem('user'));
    let headerData = {
        headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"]
        }
    };
    return axios.post(process.env.REACT_APP_API_URL + "/api/notifications/send", messageData, headerData)
   .then(response => {
        return response.data;
    })    
}
function postMessageMulti(messageData){
    let user = JSON.parse(localStorage.getItem('user'));
    let headerData = {
        headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"]
        }
    };
    return axios.post(process.env.REACT_APP_API_URL + "/api/notifications/sendmulti", messageData, headerData)
   .then(response => {
        return response.data;
    })    
}
function deleteMessage(messageID){
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.delete(process.env.REACT_APP_API_URL + "/api/notifications/delete/" + messageID,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            },
            params: {
                "message_id": messageID
            }
        })
        .then(response => {
            
            return response.data;
        })
}
