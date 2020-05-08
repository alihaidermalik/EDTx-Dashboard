import axios from "axios/index";

export const studentsService = {   
    getStudents, 
    
}; 
function getStudents(username = undefined, cohortGroup = undefined){
    let user = JSON.parse(localStorage.getItem('user'));
    let qp = "?";
    qp += username ? "username= " + username + "&": ""
    qp += cohortGroup ? "cohortGroup= " + cohortGroup : ""
    //
    return axios.get(process.env.REACT_APP_API_URL + "/api/courses/students" + qp,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            
            return response.data;
        })
}

function getCohorts(course = undefined){

    let user = JSON.parse(localStorage.getItem('user'));
    
    return axios.get(process.env.REACT_APP_API_URL + "/api/cohorts/course-v1:RuralMetro+FALI_1+2019_10_01/",
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            console.log(response)
            return response.data;
        })

}

// function getStudentDetails(studentID){
//     let user = JSON.parse(localStorage.getItem('user'));
//     return axios.get(process.env.REACT_APP_API_URL + "/api/planning/student/" + studentID,
//         {
//             headers: {
//                 "X-Authorization": "Token " + user["access_token"]
//             },
//             params: {
//                 "students_id": studentID
//             }
//         })
//         .then(response => {
//             
//             return response.data;
//         })
// }

// function updateStudentById(studentId, studentData){
//     let user = JSON.parse(localStorage.getItem('user'));
//     var headerData = {
//         headers : {
//         'Content-Type': 'application/json; charset=UTF-8',
//         "X-Authorization": "Token " + user["access_token"]
//         }
//     }
//     
//     
//     return axios.patch(process.env.REACT_APP_API_URL + "/api/planning/student/" + studentId, studentData, headerData)        
//    .then(response => {
//         return response.data;
//     })   
// }

// function deleteStudent(studentID){
//     let user = JSON.parse(localStorage.getItem('user'));
//     return axios.delete(process.env.REACT_APP_API_URL + "/api/planning/student/" + studentID,
//         {
//             headers: {
//                 "X-Authorization": "Token " + user["access_token"]
//             },
//             params: {
//                 "students_id": studentID
//             }
//         })
//         .then(response => {
//             
//             return response.data;
//         })
// }

// function createStudent(studentData){
//     let user = JSON.parse(localStorage.getItem('user'));
//     var headerData = {
//         headers : {
//         'Content-Type': 'application/json; charset=UTF-8',
//         "X-Authorization": "Token " + user["access_token"]
//         }
//     }
//     
//     
//     return axios.post(process.env.REACT_APP_API_URL + "/api/planning/student", studentData, headerData)        
//    .then(response => {
//         return response.data;
//     })    
// }




