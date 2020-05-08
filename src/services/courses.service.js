import axios from "axios/index";

export const coursesService = {
    getCourses,
    getCourseDetails,
    getCourseTasktree,
    getXBlockInfo,
    createCourse,
    getCourseById,
    updateCourseById
};

function getCourses() {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.get(process.env.REACT_APP_API_URL + "/api/courses/list",
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            return response.data;
        })
}

function getCourseDetails(courseID){
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.get(process.env.REACT_APP_API_URL + "/api/courses/details",
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            },
            params: {
                "course_id": courseID
            }
        })
        .then(response => {
            return response.data;
        })
}

function getCourseTasktree(courseID){
    
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.get(process.env.REACT_APP_API_URL + "/api/courses/tasktree",
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            },
            params: {
                "course_id": courseID
            }
        })
        .then(response => {
            return response.data;
        })
}

function getXBlockInfo(blockID){
    let user = JSON.parse(localStorage.getItem('user'));
    
    
   
    return axios.get(process.env.REACT_APP_API_URL + "/api/courses/xblockinfo",
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            },
            params: {
                "block_id": blockID
            }
        })
        .then(response => {
            return response.data;
        })
}

function createCourse(courseData){
    let user = JSON.parse(localStorage.getItem('user'));
    var headerData = {
        headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"]
        }
    }
    
    return axios.post(process.env.REACT_APP_API_URL + "/api/studio/create_course", courseData, headerData)        
   
    .then(response => {
        return response.data;
    })    
}

function getCourseById(courseId){
    let user = JSON.parse(localStorage.getItem('user'));
    var headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"]
    }
    return axios.get(process.env.REACT_APP_API_URL + "/api/studio/course",
    {
        headers: headers,
        params: {
            "course_id": courseId
        }
    })
    .then(response => {
        
        return response.data;
    })    
}

function updateCourseById(courseId, courseData){
    let user = JSON.parse(localStorage.getItem('user'));
    var headerData = {
        headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"],
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": 'HEAD, GET, POST, PUT, PATCH, DELETE',
            "Access-Control-Allow-Headers": 'Origin, Content-Type, X-Auth-Token',
        }
    }
   
    return axios.put(process.env.REACT_APP_API_URL + "/api/studio/course/" + courseId,courseData, headerData)
    .then(response => {
        
        return response.data;
    })    
}