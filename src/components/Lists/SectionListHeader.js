import {CardMedia, CardText, CardTitle} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import React from 'react';
import {NavLink} from 'react-router-dom';


const SectionListHeader = ({deets, courseID}) => {
    return <div>
        <CardMedia>
            <img src={deets.media ? deets.media.image.large : ""} alt=""/>
        </CardMedia>
        <CardTitle title={deets.name ? deets.name : "No name available."}
                   subtitle={deets.start_display ? deets.start_display : "No start time available."}
                   style={{display: "inline-block", width: "88%"}}/>
        <NavLink style={{display: "inline-block", width: "8%"}} to={"/edit_course/" + courseID} key={courseID}>
            <IconButton>
                <EditIcon/>
            </IconButton>
        </NavLink>
        <CardText>
            <div
                dangerouslySetInnerHTML={{__html: deets.short_description ? deets.short_description.toString() : "No description"}}/>
        </CardText>
    </div>;
};

export default SectionListHeader;