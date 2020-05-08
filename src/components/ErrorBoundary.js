import React, {Component} from "react";
import Paper from 'material-ui/Paper';
import {Card, CardText} from 'material-ui/Card';


export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null

        };
    }

    componentDidCatch(error, info) {
        this.setState({
            hasError: true,
            error: error,
            errorInfo: info
        });
    }

    render() {
        if (this.state.hasError) {
            return <Paper>
                <h1>Something went wrong.</h1>
                <br/>
                <div>
                    <br/>
                    <Card>
                        <CardText>
                            <h2>Error info</h2>
                            <br/>
                            {this.state.errorInfo.componentStack}
                        </CardText>
                    </Card>
                </div>
            </Paper>;
        }
        return this.props.children;
    }
}