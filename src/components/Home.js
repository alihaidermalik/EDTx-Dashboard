import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import { namingConstants } from '../constants';
import PaymentIcon from 'material-ui/svg-icons/action/payment';
import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import Competence from '../dashboard-icons/1.png';
import Planning from '../dashboard-icons/2.png';
import Review from '../dashboard-icons/3.png';
import Reports from '../dashboard-icons/4.png';
import Payments from '../dashboard-icons/5.png';
import Simulator from '../dashboard-icons/6.png';
import Messages from '../dashboard-icons/7.png';
import Calendar from '../dashboard-icons/8.png';
import Certificate from '../dashboard-icons/9.png';


const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        overflowY: 'auto',
        width: '100%'
    },
    gridIcon: {
        height: "70%", width: "50%", margin: "10% 0% 25% 25%"
    }

};
const tilesData = [
    {
        title: namingConstants.COURSE_PLURAL,
        //to: '/courses',
        to: '',
        iconLarge: Competence,
        //backgroundColor: "#4c0572",
        backgroundColor:"#A9A9A9"
    },
    {
        title: 'Planning',
        to: '/planning',
        iconLarge: Planning,
        backgroundColor: "#2b3f9f",
    },
    {
        title: 'Grade Review',
        to: '/review',
        iconLarge: Review,
        backgroundColor: "#15237e",
    },
    {
        title: 'Reports',
        //to: '/reports',
        to: '',
        iconLarge: Reports,
        backgroundColor:"#A9A9A9"
        //backgroundColor: "#1a5e20",
        // onClick: (event) => {
        //     event.preventDefault();
        //     window.open("https://qbimanalytics.se/Account/SignIn");
        // }
    },
    {
        title: 'Payments',
        //to: '/payments',
        to:'',
        iconLarge: Payments,
        //backgroundColor: "#e98d09",
        backgroundColor:"#A9A9A9",
    },
    {
        title: 'Simulator',
        //to: '/simulator',
        to: '/',
        iconLarge: Simulator,
        //backgroundColor: "#7b1ea2",
        backgroundColor:"#A9A9A9",
        // onClick: (event) => {
        //     event.preventDefault();
        //     window.open("https://app.lms-demo.euvic.pl/login");
        // }
    },
    {
        title: 'Messages',
        to: '/messages_chat',
        iconLarge: Messages,
        backgroundColor: "#414141",
    },
    {
        title: 'Calendar Link',
        to: '/cal_link',
        iconLarge: Calendar,
        backgroundColor: "rgb(137, 49, 49)",
    },
    {
        title: 'Certificates',
        to: '/certificates',
        iconLarge: Certificate,
        backgroundColor: "#A72E5A",
    },

];

export class Home extends Component {
    render() {
        return (
            <div style={{marginLeft:45}}>
            <h3 style={{marginLeft:40, marginTop:30}}>YOUR APPLICATIONS</h3>
            <div style={{ display: "flex",  width:isMobile ? 250 : 1000}}>

                <br />
                <div className={"edtx-paper"} style={{ marginTop: isMobile ? 0 : 0, zDepth: 0}}>
                    <GridList
                        cellHeight={'auto'}
                        style={styles.gridList}
                        cols={isMobile ? 1 : 5}
                    >
                        {tilesData.map((tile, i) => (
                            <div style={{textAlign : "center",marginBottom: 45}}>
                            <div style={{marginLeft : 18,height:130 , width : 130 , marginBottom: 15,boxShadow : "4px 4px 8px 0px #d9d7d7"}}>
                            <GridTile
                                key={i}
                                containerElement={<NavLink key={i} to={tile.to}></NavLink>}
                                actionPosition={'right'}
                                style={{ backgroundColor: tile.backgroundColor}}
                                onClick={tile.onClick}
                            >
                                <div style={{marginTop : 35}}>
                                    <img src={tile.iconLarge} height={55}/>
                                </div>
                            </GridTile>
                            </div>
                            <a href={tile.to} style={{textDecoration : "none", color:"#000000"}}>{tile.title}</a>
                            </div>
                        ))}
                    </GridList>
                </div>
            </div>
            </div>
        )
    }
}
