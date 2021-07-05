import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import ReactQuill, { Quill } from "react-quill";
// import { ImageResize } from "quill-image-resize-module";
import "./TextEditor.css";
// Quill.register("modules/ImageResize", ImageResize);
import { Button } from "antd";

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    }
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ],
    }

    this.formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ]
  }



  render() {
    return (
      <div className="text-editor">
        <ReactQuill theme="snow"
          modules={this.modules}
          formats={this.formats}>
        </ReactQuill>
      </div>
    );
  }
}
export default TextEditor;
