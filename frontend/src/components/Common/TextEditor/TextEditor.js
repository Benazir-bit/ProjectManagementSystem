import React, { Component, Fragment } from "react";
import ReactQuill from "react-quill";
// import { ImageResize } from "quill-image-resize-module";
import "./TextEditor.css";
import "react-quill/dist/quill.snow.css";
// Quill.register("modules/ImageResize", ImageResize);

// class TextEditor extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       text: "",
//     }
//     this.modules = {
//       toolbar: [
//         [{ 'header': [1, 2, false] }],
//         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//         [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
//         ['link', 'image'],
//         ['clean']
//       ],
//     }

//     this.formats = [
//       'header',
//       'bold', 'italic', 'underline', 'strike', 'blockquote',
//       'list', 'bullet', 'indent',
//       'link', 'image'
//     ]
//   }



//   render() {
//     return (
//       <div className="text-editor">
//         <ReactQuill theme="snow"
//           modules={this.modules}
//           formats={this.formats}>
//         </ReactQuill>
//       </div>
//     );
//   }
// }
// export default TextEditor;

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
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: ["small", false, "large"] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" }
        ],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
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
    if (this.quillRef !== null) return;

    const quillRef = this.reactQuillRef.getEditor();
    if (quillRef !== null) this.quillRef = quillRef;
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
