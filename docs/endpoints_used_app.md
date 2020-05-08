# Endpoints used by EDTX React app

REACT_APP_API_URL=https://edtx-api.herokuapp.com

## User

- login                 | **POST**      | `REACT_APP_API_URL/api/auth/edtxlogin`
- logout                | **GET**       | `REACT_APP_API_URL/api/auth/username`

## Account

## Students - teacher's pane

- getStudents           | **GET**      | `REACT_APP_API_URL/api/courses/students`

## Courses

- getCourses            | **GET**      | `REACT_APP_API_URL/api/courses/list`
- getCourseDetails      | **GET**      | `REACT_APP_API_URL/api/courses/details`
- getCourseTasktree     | **GET**      | `REACT_APP_API_URL/api/courses/tasktree`
- getXBlockInfo         | **GET**      | `REACT_APP_API_URL/api/courses/xblockinfo`
- createCourse          | **POST**     | `REACT_APP_API_URL/api/auth/create_course`
- getCourseById         | **GET**      | `REACT_APP_API_URL/api/courses/course`
- updateCourseById      | **PUT**      | `REACT_APP_API_URL/api/courses/course`

## Activities

- getQuests             | **GET**      | `REACT_APP_API_URL/api/planning/quests`
- getQuestDetails       | **GET**      | `REACT_APP_API_URL/api/planning/quests/`
- updateQuestById       | **PATCH**    | `REACT_APP_API_URL/api/planning/quests/`
- deleteQuest           | **DELETE**   | `REACT_APP_API_URL/api/planning/quests/`
- createQuest           | **POST**     | `REACT_APP_API_URL/api/planning/quests`

## Blockgroups

## Section - Studio CRUD-API

- createSection         | **POST**     | `REACT_APP_API_URL/api/studio/section`
- updateSectionById     | **PUT**      | `REACT_APP_API_URL/api/studio/section/`
- getSectionDetails     | **GET**      | `REACT_APP_API_URL/api/studio/section/`
- deleteSection         | **DELETE**   | `REACT_APP_API_URL/api/studio/section/`

## Cohorts

