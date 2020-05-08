import CircularProgress from 'material-ui/CircularProgress';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {messageActions} from '../../actions';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { darkBlack} from 'material-ui/styles/colors';

class ContactsComponent extends Component {
    constructor() {
        super();

        this.courseID = null;
        this.state = {};
    }

    componentWillMount() {
        const {dispatch} = this.props;

        dispatch(messageActions.getContacts());
    }

    render() {
        const {fetching} = this.props;      
        return (         
            <div style={this.props.style}>   
                {fetching ?
                    <div>
                        <CircularProgress size={60} thickness={7} />
                    </div> 
                    :
                    <List>
                        <Subheader>Contacts</Subheader>
                    {this.props.contactData && this.props.contactData.results && this.props.contactData.results.length > 0?
                        this.props.contactData.results.map((contact, i) => (
                            [                                    
                            <ListItem
                                leftAvatar={<Avatar src={contact.profile_image.image_url_small} />}
                                primaryText={contact.firstname + " " + contact.lastname}
                                secondaryText={
                                    <p>
                                    <span style={{color: darkBlack}}>{contact.username}</span><br />
                                    {contact.email}
                                    </p>
                                }
                                secondaryTextLines={2}
                                onClick={() => this.props.onClick(contact)}
                                />
                            ]                                    
                        ))
                        :
                        <span>No contacts.</span>
                    }
                    </List>
                }
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

const connectedContactsComponent = connect(mapStateToProps)(ContactsComponent);
export {connectedContactsComponent as ContactsComponent};
