import axios from "axios/index";

export const homeworkService = {
    getHomeworkByBlockId,
    getHomeworkByStudentId,
    setHomeworkOnBlockByStudentId,
    getHomeworkFiles,
    getHomeworkOnBlockByStudentId
};

function getHomeworkByBlockId(activityId, blockId) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.get(process.env.REACT_APP_API_URL + `/api/planning/homework/${activityId}/task/${blockId}`,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            return response.data;
        })
}

function getHomeworkByStudentId(activityId, studentId) {
    let user = JSON.parse(localStorage.getItem('user'));
    // 
    return axios.get(process.env.REACT_APP_API_URL + `/api/planning/homework/${activityId}/user/${studentId}`,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            return response.data;
        })
}

function getHomeworkOnBlockByStudentId(activityId, blockId, studentId) {
    let user = JSON.parse(localStorage.getItem('user'));


    return axios.get(process.env.REACT_APP_API_URL + `/api/planning/homework/${activityId}/${blockId}/${studentId}`,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            return response.data;
        })

}
function setHomeworkOnBlockByStudentId(activityId, blockId, studentId, gradeData) {
    let user = JSON.parse(localStorage.getItem('user'));
    let headerData = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            "X-Authorization": "Token " + user["access_token"]
        }
    };


    return axios.post(process.env.REACT_APP_API_URL + `/api/planning/homework/${activityId}/${blockId}/${studentId}`, gradeData, headerData)
        .then(response => {
            return response.data;
        })

}

function getHomeworkFiles(activityId, studentId) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.get(process.env.REACT_APP_API_URL + `/api/planning/homework/${activityId}/files/${studentId}`,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            return response.data;
        })
}

