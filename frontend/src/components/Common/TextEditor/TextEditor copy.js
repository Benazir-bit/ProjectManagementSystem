import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import ReactQuill, { Quill } from "react-quill";
// import { ImageResize } from "quill-image-resize-module";
import "./TextEditor.css";
// Quill.register("modules/ImageResize", ImageResize);
import { Button } from "antd";

class TextEditor extends Component {
  getValues = () => {
    this.props.setParentState(this.state.text);
    var range = this.quillRef.getSelection();
    let position = range ? range.index : 0;
    this.quillRef.setText(position, "");
  };
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      content: ""
    };
    this.handleChange = this.handleChange.bind(this);

    this.modules = {
      // ImageResize: {
      //   displaySize: true
      // },
      toolbar: [
        [{ size: ["small", false, "large"] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" }
        ],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }]
      ]
    };
    this.formats = [
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "color",
      "background",
      "align"
    ];
  }
  handleChange(value) {
    this.setState({ text: value });
  }
  componentDidMount() {
    this.attachQuillRefs();
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs() {
    // Ensure React-Quill reference is available:
    if (typeof this.reactQuillRef.getEditor !== "function") return;
    // Skip if Quill reference is defined:
    if (this.quillRef != null) return;

    const quillRef = this.reactQuillRef.getEditor();
    if (quillRef != null) this.quillRef = quillRef;
  }

  render() {
    //console.log(this.state.text);

    return (
      <Fragment>
        <ReactQuill
          theme={"snow"}
          ref={el => {
            this.reactQuillRef = el;
          }}
          value={this.state.text}
          modules={this.modules}
          formats={this.formats}
          onChange={this.handleChange}
        />
        <br />
        {/* <div style={{ textAlign: "end", paddingRight: "1em" }}>
					<Button onClick={this.clear} type="primary">
						Clear
					</Button>
				</div> */}
      </Fragment>
    );
  }
}

export default TextEditor;
