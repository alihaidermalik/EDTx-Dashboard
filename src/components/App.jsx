import React from 'react';
import { Router, NavLink, Route } from "react-router-dom";
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { isMobile } from 'react-device-detect';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Home } from './Home';
import { Logged } from './Logged';
import { Login } from './Login/Login';
import { LoginPage } from './Login/LoginPage';
import { Settings } from "./Settings";
import { PrivateRoute } from './PrivateRoute';
import { CourseList } from "./Lists/CourseList";
import { SectionList } from "./Lists/SectionList";
import { SubsectionList } from "./Lists/SubsectionList";
import { UnitList } from "./Lists/UnitList";
import { ComponentList } from "./Lists/ComponentList";
import { ComponentPage } from "./Component/ComponentPage";
import { TBD } from "./TBD";
import { Planning } from "./Quests/QuestList";
import { EditCourse } from './Course/EditCourse';
import { EditSection } from './Section/EditSection';
import { EditComponent } from './Component/EditComponent';
import { history } from '../helpers/index';
import { alertActions } from '../actions/index';
import logo from '../logo.png';
import './App.css';
import { CreateSection } from './Section/CreateSection';
import { CreateCourse } from './Course/CreateCourse';
import { CreateCourse as CreateCourse2 } from './Course/CreateCourse.old';
//Nested list
import { CreateQuest } from './Quests/CreateQuest';
import { Quest } from './Quests/Quest';
import { EditQuest } from './Quests/EditQuest';
import { namingConstants } from '../constants';
import { CreateCohort } from './Students/CreateCohort';
import { CreateTaskGroup } from './Tasks/CreateTaskGroup';
import { Calendar } from './Calendar/Calendar';
import { ReviewList } from "./Review/ReviewList";
import { ReviewCalendar } from "./Review/ReviewCalendar";

import { Review } from "./Review/Review";
import { Grade } from "./Review/Grade";
import { Payments } from "./Payments/Payments";
import { Reports } from "./Reports/Reports";
import { MessageList } from './Messages/MessageList';
import {SendMessage} from './Messages/SendMessage';
import { Contacts } from './Messages/Contacts';
import { CalLink } from "./CalLink";

import { Help } from './Help';
import { MessageChat } from './Messages/MessageChat';
import { Certificate } from './Certificates/Certificate';
import UserProfile from './Certificates/UserProfile';
import AddRole from './Certificates/AddRole';
import AddCertificate from './Certificates/AddCertificate';
import AddNewCertificate from './Certificates/AddNewCertificate';
import ViewCertificate from './Certificates/ViewCertificate';
import EditCertificate from './Certificates/EditCertificate';
import AddNewRole from './Certificates/AddNewRole';
import ViewRole from './Certificates/ViewRole';
import EditRole from './Certificates/EditRole';
import UserArchive from './Certificates/UserArchive';

const styles = ({
    navListItem: {
        fontSize: "15px",
        color: "#ffffff",
        marginLeft: "15px",
        lineHeight: "100%"
    },
});
const MenuLogo = () => (
    <div className={"menu-logo-div"} style={{ padding: "20px 0 16px 33px"}}>
        <NavLink to="/" >
            <img src={logo} className={"menu-logo-img"} height={30} alt="logo" />
        </NavLink>
    </div>
);
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: !isMobile,
        };
        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });
    }
    toggleSidebar = (event, logged) => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    };
    render() {
        const { alert } = this.props;
        return (
            <Router history={history}>
                <div>
                    <MuiThemeProvider>
                        <div className={this.state.sidebarOpen ? "drawer-push" : "drawer-close"}>
                            <Drawer
                                open={this.state.sidebarOpen}
                                containerClassName={"the-drawer"}

                            >
                                <MenuLogo />
                                <List style={{ padding: "0 0 0 17px"}}>
                                    <ListItem
                                        key="dashboard"
                                        primaryText={namingConstants.DASHBOARD}
                                        style={{ fontSize: "15px", color: "#ffffff", textDecoration: "none"}}
                                        //leftIcon={<AssignmentIcon color={"#ffffff"} />}                                        
                                        onClick={() => {  
                                            if(isMobile){
                                                this.toggleSidebar()                                          
                                            }
                                            history.push('/');
                                        }}
                                    />
                                    {/* ---- disabled from client ----
                                    <ListItem
                                        key="competences" //TODO: use Listitems as parents in nesteditems, anything else throws a warning
                                        primaryText={namingConstants.COURSE_PLURAL}
                                        classes={{disabled: 'true' }}
                                        style={{ fontSize: "15px", color: "#ffffff", textDecoration: "none"}}
                                        //leftIcon={<AssignmentIcon color={"#ffffff"} />}                                        
                                        onClick={() => {  
                                            if(isMobile){
                                                this.toggleSidebar()                                          
                                            }
                                            history.push('/courses');
                                        }}
                                        initiallyOpen={false}
                                        primaryTogglesNestedList={false}
                                        nestedItems={[
                                            <NavLink to="/courses" style={{ textDecoration: "none", marginLeft: "15x !important" }} key="courses">
                                                <ListItem primaryText="List all" style={styles.navListItem}  onClick={isMobile ? this.toggleSidebar : () => { }} />
                                            </NavLink>,
                                            <NavLink to="/new_course" style={{ textDecoration: "none" }} key="new_course">
                                                <ListItem 
                                                primaryText=
                                                {"Create new" 
                                                // + namingConstants.COURSE
                                                } 
                                                style={styles.navListItem}  onClick={isMobile ? this.toggleSidebar : () => { }} />
                                            </NavLink>,
                                        ]}
                                    />
                                    */}
                                    <ListItem
                                        key="planning"
                                        primaryText="Planning"
                                        style={{ fontSize: "15px", color: "#ffffff", textDecoration: "none" }}
                                        //leftIcon={<AssignmentIcon color={"#ffffff"} />}
                                        // onClick={isMobile ? this.toggleSidebar : () => { }}
                                        initiallyOpen={false}
                                        onClick={() => {                                            
                                            if(isMobile){
                                                this.toggleSidebar()                                          
                                            }
                                            history.push('/calendar');
                                        }}
                                        primaryTogglesNestedList={false}
                                        nestedItems={[
                                            <NavLink key="nav-calendar" to="/calendar" style={{ textDecoration: "none" }}>
                                                <ListItem primaryText="Calendar" style={styles.navListItem} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                            </NavLink>,
                                            <NavLink to="/planning" style={{ textDecoration: "none", marginLeft: "15x !important" }} key="planning">
                                                <ListItem primaryText="List Activities" style={styles.navListItem} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                            </NavLink>,
                                            <NavLink to="/new_quest" style={{ textDecoration: "none" }} key="new_quest">
                                                <ListItem primaryText="Create Activity" style={styles.navListItem} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                            </NavLink>,
                                        ]}
                                    />
                                     <ListItem
                                        key="review"
                                        primaryText="Reviews"
                                        style={{ fontSize: "15px", color: "#ffffff", textDecoration: "none" }}
                                        //leftIcon={<AssignmentIcon color={"#ffffff"} />}
                                        // onClick={isMobile ? this.toggleSidebar : () => { }}
                                        initiallyOpen={false}
                                        onClick={() => {                                            
                                            if(isMobile){
                                                this.toggleSidebar()                                          
                                            }
                                            history.push('/review_calendar');
                                        }}
                                        primaryTogglesNestedList={false}
                                        nestedItems={[
                                            <NavLink key="nav-review-calendar" to="/review_calendar" style={{ textDecoration: "none" }}>
                                                <ListItem primaryText="Calendar" style={styles.navListItem} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                            </NavLink>,
                                            <NavLink to="/review" style={{ textDecoration: "none", marginLeft: "15x !important" }} key="review-list">
                                                <ListItem primaryText="List Reviews" style={styles.navListItem} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                            </NavLink>                                            
                                        ]}
                                    />                                   
                                    {/* <NavLink to="/review_calendar" style={{ textDecoration: "none", marginLeft: "15x !important" }} key="Reviews">
                                        <ListItem
                                            key="review"
                                            primaryText="Reviews"
                                            style={{ fontSize: "15px", color: "#ffffff", textDecoration: "none" }}
                                            //leftIcon={<AssignmentIcon color={"#ffffff"} />}
                                        />
                                    </NavLink> */}
                                    
                                    {/* ------ Disabled from client--------
                                    <ListItem onClick={(event) => {
                                        event.preventDefault();
                                        window.open("https://qbimanalytics.se/Account/SignIn");
                                        }}
                                        primaryText="Reports"
                                        style={{ fontSize: "15px", color: "#ffffff" }}
                                        //leftIcon={<DescriptionIcon color={"#ffffff"} />}
                                    />
                                    <NavLink to="/payments" style={{ textDecoration: "none", marginLeft: "15x !important" }} key="Payments">
                                        <ListItem
                                            key="payments"
                                            primaryText="Payments"
                                            style={{ fontSize: "15px", color: "#ffffff", textDecoration: "none" }}
                                            //leftIcon={<AssignmentIcon color={"#ffffff"} />}
                                        />
                                    </NavLink>
                                    <ListItem onClick={(event) => {
                                        event.preventDefault();
                                        window.open("https://app.lms-demo.euvic.pl/login");
                                    }}
                                        primaryText="Simulator"
                                        style={{ fontSize: "15px", color: "#ffffff" }}
                                        //leftIcon={<DescriptionIcon color={"#ffffff"} />}
                                    />
                                */}
                                    {/* <NavLink to="/messages" style={{ textDecoration: "none", marginLeft: "15x !important" }} key="Messages">
                                        <ListItem
                                            key="messages"
                                            primaryText="Messages"
                                            style={{ fontSize: "15px", color: "#ffffff", textDecoration: "none" }}
                                            leftIcon={<FeedbackIcon color={"#ffffff"} />}
                                        />
                                    </NavLink> */}
                                    <ListItem
                                        key="messages"
                                        primaryText="Messages"
                                        style={{ fontSize: "15px", color: "#ffffff", textDecoration: "none" }}
                                        //leftIcon={<FeedbackIcon color={"#ffffff"} />}
                                        // onClick={isMobile ? this.toggleSidebar : () => { }}
                                        initiallyOpen={false}
                                        primaryTogglesNestedList={false}                                       
                                        onClick={() => {                                            
                                            if(isMobile){
                                                this.toggleSidebar()                                          
                                            }
                                            history.push('/messages_chat');
                                        }}
                                        
                                        nestedItems={[
                                            <ListItem
                                            key="chat-messages"
                                            primaryText="Chat"
                                            style={styles.navListItem}
                                            onClick={() => {
                                                history.push('/messages_chat');
                                            }} 
                                            />
                                            ,
                                            // <ListItem
                                            // key="view-messages"
                                            // primaryText="View"
                                            // style={styles.navListItem}
                                            // onClick={(e) => {
                                            //     e.preventDefault();
                                            //     history.push('/messages');
                                            // }}
                                            // />,
                                            <ListItem
                                            key="send-messages"
                                            primaryText="Send"
                                            style={styles.navListItem}
                                            onClick={() => {
                                                history.push('/send_message');
                                            }}
                                            />                                            
                                            // ,
                                            // <ListItem
                                            // key="contacts-messages"
                                            // primaryText="Contacts"
                                            // style={{ fontSize: "20px", color: "GREY", marginLeft: "15x" }}
                                            // leftIcon={<ActionPermContactCalendar color={"#ffffff"} />}
                                            // onClick={() => {
                                            //     history.push('/contacts');
                                            // }}
                                            // />
                                        ]}
                                    />
                                    <ListItem onClick={(event) => {
                                        event.preventDefault();
                                        history.push('/cal_link');
                                    }}
                                        primaryText="Calendar Link"
                                        style={{ fontSize: "15px", color: "#ffffff" }}
                                        //leftIcon={<DescriptionIcon color={"#ffffff"} />}
                                    />
                                    <ListItem onClick={(event) => {
                                        event.preventDefault();
                                        history.push('/certificates');
                                    }}
                                        primaryText="Certificates"
                                        style={{ fontSize: "15px", color: "#ffffff" }}
                                        //leftIcon={<DescriptionIcon color={"#ffffff"} />}
                                    />
                                    {/* <NavLink to="/calendar" style={{ textDecoration: "none" }}>
                                        <ListItem primaryText="Calendar" style={{ fontSize: "20px", color: "#ffffff" }} leftIcon={<ActionPermContactCalendar color={"#ffffff"} />} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                    </NavLink> */}
                                    {/*
                                    //TODO: implement these
                                    <NavLink to="/students" style={{ textDecoration: "none" }}>
                                        <ListItem primaryText="Students" style={{ fontSize: "20px", color: "#ffffff" }} leftIcon={<DescriptionIcon color={"#ffffff"} />} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                    </NavLink>
                                    <NavLink to="/tasks" style={{ textDecoration: "none" }}>
                                        <ListItem primaryText="Tasks" style={{ fontSize: "20px", color: "#ffffff" }} leftIcon={<DescriptionIcon color={"#ffffff"} />} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                    </NavLink>
                                    <NavLink to="/reports" style={{ textDecoration: "none" }}>
                                        <ListItem primaryText="Reports" style={{ fontSize: "20px", color: "#ffffff" }} leftIcon={<DescriptionIcon color={"#ffffff"} />} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                    </NavLink>
                                    <NavLink to="/budget" style={{ textDecoration: "none" }}>
                                        <ListItem primaryText="Budget" style={{ fontSize: "20px", color: "#ffffff" }} leftIcon={<DescriptionIcon color={"#ffffff"} />} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                    </NavLink> */}
                                    {/*
                                    <NavLink to="/settings" style={{ textDecoration: "none" }}>
                                        <ListItem primaryText="Settings" style={{ fontSize: "20px", color: "#ffffff" }} leftIcon={<SettingsIcon color={"#ffffff"} />} onClick={isMobile ? this.toggleSidebar : () => { }} />
                                    </NavLink> */}
                                </List>
                            </Drawer>
                            <AppBar
                                style={{ backgroundColor: '#f4f4f4', paddingRight: 75 }}
                                title={
                                    <div className="Aligner" style={{ "visibility": this.state.sidebarOpen ? "hidden" : "visible" }}>
                                        <NavLink to="/" className="Aligner">
                                            <img src={logo} className="App-logo" height={30} alt="logo" />
                                        </NavLink>
                                    </div>}
                                onLeftIconButtonClick={this.toggleSidebar}
                                iconElementLeft={this.state.sidebarOpen ?
                                    <IconButton><NavigationClose color="primary"/></IconButton> :
                                    <IconButton><NavigationMenu color="primary"/></IconButton>}
                                    
                                iconElementRight={localStorage.getItem('user') ? <Logged username={"A user"} /> : <Login style={{color:"#ffffff"}}/>}
                            />
                            {alert.message &&
                                <div className={"flash-message"}>
                                    <strong>{alert.message.toString()}</strong>
                                </div>
                            }
                            <Route exact path="/" component={Home} />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/settings" component={Settings} />
                            <PrivateRoute exact path="/courses" component={CourseList} />
                            <PrivateRoute exact path="/courses/:id" component={SectionList} />
                            <PrivateRoute exact path="/sections/:courseid/:blockid" component={SubsectionList} />
                            <PrivateRoute exact path="/subsections/:courseid/:blockid" component={UnitList} />
                            <PrivateRoute exact path="/units/:courseid/:blockid" component={ComponentList} />
                            <PrivateRoute exact path="/components/:courseid/:blockid" component={ComponentPage} />
                            <PrivateRoute exact path="/new_course" component={CreateCourse} />
                            <PrivateRoute exact path="/new_course_old" component={CreateCourse2} />
                            <PrivateRoute exact path="/new_section/:courseid/:blockid" component={CreateSection} type="sections" />
                            <PrivateRoute exact path="/new_subsection/:courseid/:blockid" component={CreateSection} type="subsections" />
                            <PrivateRoute exact path="/new_unit/:courseid/:blockid" component={CreateSection} type="units" />
                            <PrivateRoute exact path="/new_component/:courseid/:blockid" component={CreateSection} type="components" />
                            <PrivateRoute exact path="/edit_course/:id" component={EditCourse} />
                            <PrivateRoute exact path="/edit_section/:id/:blockid" component={EditSection} type="sections" />
                            <PrivateRoute exact path="/edit_subsection/:id/:blockid" component={EditSection} type="subsections" />
                            <PrivateRoute exact path="/edit_unit/:id/:blockid" component={EditSection} type="units" />
                            <PrivateRoute exact path="/edit_component/:id/:blockid" component={EditComponent} type="components" />
                            <PrivateRoute exact path="/planning" component={Planning} />
                            <PrivateRoute exact path="/new_quest" component={CreateQuest} />
                            <PrivateRoute exact path="/new_quest/:check" component={CreateQuest} />
                            <PrivateRoute exact path="/students" component={CreateCohort} />
                            <PrivateRoute exact path="/tasks" component={CreateTaskGroup} />
                            <PrivateRoute exact path="/reports" component={Reports} />
                            <PrivateRoute exact path="/quests/:id" component={Quest} />
                            <PrivateRoute exact path="/edit_quest/:id" component={EditQuest} />
                            <PrivateRoute exact path="/budget" component={TBD} />
                            <PrivateRoute exact path="/calendar" component={Calendar} />
                            <PrivateRoute exact path="/review" component={ReviewList} />
                            <PrivateRoute exact path="/review_calendar" component={ReviewCalendar} />

                            <PrivateRoute exact path="/review/:id" component={Review} />
                            <PrivateRoute exact path="/grade/:id" component={Grade} />
                            <PrivateRoute exact path="/payments" component={Payments} />

                            <PrivateRoute exact path="/messages" component={MessageList} />
                            <PrivateRoute exact path="/send_message" component={SendMessage} />
                            <PrivateRoute exact path="/contacts" component={Contacts} />
                            <PrivateRoute exact path="/messages_chat" component={MessageChat} />


                            <PrivateRoute exact path="/help" component={Help} />
                            <PrivateRoute exact path="/cal_link" component={CalLink} />
                            <PrivateRoute exact path="/certificates" component={Certificate} />
                            <PrivateRoute exact path="/userProfile/:id" component={UserProfile} />
                            <PrivateRoute exact path="/addRole/:id" component={AddRole} />
                            <PrivateRoute exact path="/addCertificate/:id" component={AddCertificate} />
                            <PrivateRoute exact path="/add_new_certificate" component={AddNewCertificate} />
                            <PrivateRoute exact path="/view_certificate/:id" component={ViewCertificate} />
                            <PrivateRoute exact path="/edit_certificate/:id" component={EditCertificate} />
                            <PrivateRoute exact path="/add_new_role" component={AddNewRole} />
                            <PrivateRoute exact path="/get_role/:id" component={ViewRole} />
                            <PrivateRoute exact path="/edit_role/:id" component={EditRole} />
                            <PrivateRoute exact path="/userArchive/:id" component={UserArchive} />

                        </div>
                    </MuiThemeProvider>
                </div>
            </Router>
        );
    }
}
function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}
const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };