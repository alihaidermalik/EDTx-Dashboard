
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import { ContactsComponent } from './ContactsComponent';
// const styles = {
//     gridKey: {
//         paddingRight: "38px",
//         overflow: "hidden",
//         alignItems: 'center',
//         display: 'flex'
//     },
//     menuItem: {
//         width: "100%"
//     },
//     customWidth: {
//         width: "100%"
//     },
//     DropDownMenu: {
//         display: 'flex',
//         width: "100%",
//         alignContent: 'center',
//         alignItems: 'center'
//     },
//     taskArea: {
//         width: "100%"
//     },
//     gradeItemMiddle: {
//         display: 'flex',
//         flex: 1,
//         justifyContent: "flex-end",
//         width: "15%"
//     },
//     gradeItemEnd: {
//         display: 'flex',
//         flex: 1,
//         justifyContent: "flex-end",
//     },
//     cutText:{ 
//         textOverflow: "ellipsis",
//         overflow: "hidden", 
//         whiteSpace: "nowrap",
//         width: "33%"
//       }
// }
class Contacts extends Component {
    constructor() {
        super();
        this.courseID = null;
        this.state = {};
    }    
    handleContactClick = (contact) => {
        
        // this.setState({
        //     recipient: contact.username
        // })
    }
    render() {
 
        return (           
            <div style={{ display: "flex", justifyContent: "center" }}>
            <br />
            <Paper className={"edtx-paper"}  style={{ height: "100%", zDepth: 2}}>
            <div style={{ display: "flex", width: "80%", alignItems: "center" }}>
                <div style={{ flex: 1 }}>                   
                </div>
                <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h2 style={{
                    width: "100%",
                    fontSize: "2em",
                    padding: "0 0.3em 0.3em 0.3em"
                }}>Contact List</h2>
                </div>
                <div style={{ flex: 1, textAlign: "end"}}>                  
                </div>
            </div>
            <div >
                <ContactsComponent onClick={this.handleContactClick} style={{height: 500,width: 500, overflow: "auto"}}/>
                </div>
            </Paper>
        </div>
            
        )
    }
}
function mapStateToProps(state) {
    const {fetching, contactData} = state.contacts;
    return {
        fetching,
        contactData
    };
}
const connectedContacts = connect(mapStateToProps)(Contacts);
export {connectedContacts as Contacts};
