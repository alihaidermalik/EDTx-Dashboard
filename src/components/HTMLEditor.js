import React, {Component} from 'react';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import sanitizeHtml from 'sanitize-html';










export class HTMLEditor extends Component {
    constructor(props) {
        super(props);
        const html = props.text === null ? "" : props.text;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
        var html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        
        var result = sanitizeHtml(html, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
        });

        if (this.props.handleChange !== undefined) {
            this.props.handleChange(result);
        }
    };
    getHTML = () => {
        const {editorState} = this.state;


        var html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        html = sanitizeHtml(html, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
        });
        
        
        
        

        return html
    }

    render() {
        const {editorState} = this.state;
        return (
            <div class="border-styling" style={{
                border: "1px solid #ccc!important",
            }}>
                <Editor
                    {...this.props}
                    editorState={editorState}
                    
                    

                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={this.onEditorStateChange}
                />

            </div>
        );
    }
}