import {combineReducers} from 'redux';

import {authentication} from './authentication.reducer';
import {filteration} from './certificateFilters.reducer';
import {users} from './user.reducer';
import {alert} from './alert.reducer';
import {courses, deetss, tasktrees, xblockinfos, createCourse, updateCourse} from "./courses.reducer";
import {createSection, updateSection, deleteSection, section} from "./section.reducer";
import {createQuest, updateQuest, deleteQuest, quests,questDetails} from "./quests.reducer";
import {students} from "./students.reducer"
import {getHomework, setHomework,getHomeworkFiles,getHomeworkOnBlockById} from "./homework.reducer"
import {trainingCenter} from "./training_center.reducer"
import {messages, postMessage,messageCount,contacts} from "./message.reducer"



import { reducer as formReducer } from 'redux-form'


const rootReducer = combineReducers({
    authentication,
    filteration,
    users,
    alert,
    courses,
    deetss,
    tasktrees,
    xblockinfos,
    createCourse,
    updateCourse,
    createSection,
    updateSection,
    deleteSection,
    section,
    createQuest,
    updateQuest,
    deleteQuest,
    quests,
    questDetails,
    students,
    getHomework,
    setHomework,
    trainingCenter,
    getHomeworkFiles,
    messages,
    postMessage,
    messageCount,
    contacts,
    getHomeworkOnBlockById,
    form: formReducer
});

export default rootReducer;
