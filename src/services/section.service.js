import axios from "axios/index";

export const sectionService = {    
    createSection,    
    updateSectionById,
    getSectionDetails,
    deleteSection
};


function createSection(sectionData){
    let user = JSON.parse(localStorage.getItem('user'));
    var headerData = {
        headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"]
        }
    }
    
    
    return axios.post(process.env.REACT_APP_API_URL + "/api/studio/section", sectionData, headerData)        
   .then(response => {
        return response.data;
    })    
}

function updateSectionById(sectionId, sectionData){
    let user = JSON.parse(localStorage.getItem('user'));
    var headerData = {
        headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"]
        }
    }
    
    
    return axios.put(process.env.REACT_APP_API_URL + "/api/studio/section/" + sectionId, sectionData, headerData)        
   .then(response => {
        return response.data;
    })   
}

function getSectionDetails(sectionID){
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.get(process.env.REACT_APP_API_URL + "/api/studio/section/" + sectionID,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            },
            params: {
                "section_id": sectionID
            }
        })
        .then(response => {
            
            return response.data;
        })
}
function deleteSection(sectionID){
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.delete(process.env.REACT_APP_API_URL + "/api/studio/section/" + sectionID,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            
            return response.data;
        })
}