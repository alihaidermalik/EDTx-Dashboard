import React, { Component } from 'react';

export class Payments extends Component {

    constructor(props) {
        super(props);
        this.state = {height: props.height};
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillMount(){
        
        this.setState({height: (window.innerHeight - 64) + 'px'});
    }

    render() {
        return (
            <iframe title="Sweetpay" src={"https://merchant.stage.sweetpay.com/"} style={{width: "100%", height: this.state.height}}/>
        )
    }
}
