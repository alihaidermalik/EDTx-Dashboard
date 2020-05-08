import axios from "axios/index";

export const trainingCentersService = {   
    getTrainingCenters, 
    
};

function getTrainingCenters(page = 1){
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.get(process.env.REACT_APP_API_URL + "/api/planning/training_centers?page=" + page,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            
            return response.data;
        })
}

