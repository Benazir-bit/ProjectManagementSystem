import React, {Component, Fragment} from 'react';
import { render } from 'react-dom';
import ReactQuill from "react-quill"
import './TextEditor.css'

class TextEditorModal extends Component{

  constructor(props){
    super(props);
    this.state = {
      text: "",
    }
    this.handleChange = this.handleChange.bind(this);
    this.modules = {
      toolbar: [
        [{ 'size': ['small', false, 'large'] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        [{ 'color': [] }, {'background' : [] }],
      ],
  },
 
    this.formats = [
      'size',
      'bold', 'italic', 'underline',
      'list', 'bullet',
      'link', 'image',  'color', 'background'
    ]
  }
  
    handleChange(value){
        this.setState({text: value});
    }


    render(){
        console.log(this.state.text);
        return (
            <Fragment>
                <ReactQuill value={this.state.text}
                    modules={this.modules}
                    formats={this.formats}
                    onChange={this.handleChange}
                     />
                     
            </Fragment>
        )
    }
}

export default TextEditorModal;


