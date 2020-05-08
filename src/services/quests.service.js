import axios from "axios/index";

export const questsService = {   
    getQuests, 
    createQuest,
    updateQuestById,
    getQuestDetails,
    deleteQuest,
    getQuestsSlim
};

function getQuests(homework=null, page = false, page_size=false){
    let user = JSON.parse(localStorage.getItem('user'));
    let questParams = {
        // "homework": homework,
    }
    if(homework !== null){
        questParams["homework"] = homework

    }
    if(page){
        questParams["page"] = page
    }
    if(page_size){
        questParams["page_size"] = page_size
    }
    
    return axios.get(process.env.REACT_APP_API_URL + "/api/planning/activity/",
        {
            params: questParams,
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            
            return response.data;
        })
}
function getQuestsSlim(homework=false, page = false, page_size=false){
    let user = JSON.parse(localStorage.getItem('user'));
    let questParams = {
        "homework": homework,
    }
    if(page){
        questParams["page"] = page
    }
    if(page_size){
        questParams["page_size"] = page_size
    }
    
    return axios.get(process.env.REACT_APP_API_URL + "/api/planning/slim_activity",
        {
            params: questParams,
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            
            return response.data;
        })
}
function getQuestDetails(questID){
    let user = JSON.parse(localStorage.getItem('user'));
    
    return axios.get(process.env.REACT_APP_API_URL + "/api/planning/activity/" + questID,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            },
            params: {
                "quests_id": questID
            }
        })
        .then(response => {
            
            return response.data;
        })
}

function updateQuestById(questId, questData){
    let user = JSON.parse(localStorage.getItem('user'));
    let headerData = {
        headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"]
        }
    };
    
    
    return axios.patch(process.env.REACT_APP_API_URL + "/api/planning/activity/" + questId, questData, headerData)
   .then(response => {
        return response.data;
    })   
}

function deleteQuest(questID){
    let user = JSON.parse(localStorage.getItem('user'));
    return axios.delete(process.env.REACT_APP_API_URL + "/api/planning/activity/" + questID,
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            },
            params: {
                "quests_id": questID
            }
        })
        .then(response => {
            
            return response.data;
        })
}

function createQuest(questData){
    let user = JSON.parse(localStorage.getItem('user'));
    let headerData = {
        headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        "X-Authorization": "Token " + user["access_token"]
        }
    };
    
    
    return axios.post(process.env.REACT_APP_API_URL + "/api/planning/activity", questData, headerData)
   .then(response => {
        return response.data;
    })    
}




