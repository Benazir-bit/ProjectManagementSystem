import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ImageSideNav from "../../../Layout/SideNav/ImageSideNav";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import { commnentIssue, markasSolution } from "../../../../actions/issues";
import { connect } from "react-redux";
import "./IssueFeedBack.css";
import TextEditor from "../../../Common/TextEditor/TextEditor";
import { Button, Form, Collapse } from "antd";
import NoData from "../../../Common/NoData/NoData";
import moment from "moment";

const { Panel } = Collapse;
class IssueFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.getTextEditor = React.createRef();
  }

  setValue = value => {
    this.setState({
      value: value
    });
  };
  getValue = () => {
    this.getTextEditor.current.getValues();
  };
  handleSubmit = e => {
    // e.preventDefault();
    var textVal = this.state.value;
    this.props.commnentIssue(this.props.issue.id, this.props.user.id, textVal);
  };

  onChange = e => {
    this.setState({ loading: true });
    // var currentDate = new Date();
    // var start_date = moment(currentDate).format("YYYY-MM-DD");
    this.props.startTask(this.props.task.id, true);
    const onClick = this.props.onClick;
    if (onClick) {
      onClick(e);
    }
  };

  Mark_Solution(id, marksolution, solved_by) {
    this.props.markasSolution(
      this.props.issue.id,
      id,
      marksolution,
      true,
      solved_by,
      true
    );
  }

  render() {
    console.log(this.props.issue.comment_set, "ok");

    const comments = this.props.issue.comment_set.map((comment_set, i) => (
      <li key={i} className="cmmnt">
        <div className="avatar">
          <Link to="/">
            <ImageSideNav
              altname={comment_set.author_user.full_name}
              id={"comment_logo"}
              srcfile={comment_set.author_user.image}
              width={"70"}
              height={"70"}
              clsattr="img-circle"
            />
          </Link>
        </div>
        <div className="cmmnt-content">
          <header id="name_feedback">
            <Link to="/" className="userlink">
              {comment_set.author_user.full_name}
            </Link>
            - <span className="pubdate">{comment_set.posted_date}</span>
            {/* {comment_set.marked_as_solution ? (
              <Icon
                type="check-circle"
                theme="filled"
                style={{ marginLeft: "10px", color: "#7cae60" }}
              />
            ) : null} */}
            {this.props.issue.solved ? null : this.props.user.id ===
              this.props.issue.raised_by ? (
              <Button
                onClick={() =>
                  this.Mark_Solution(
                    comment_set.id,
                    comment_set.body,
                    comment_set.author_user.id
                  )
                }
                size={"small"}
                style={{ float: "right", marginRight: "7px" }}
              >
                Mark as solution
              </Button>
            ) : null}
          </header>
          <p
            id="paragraph_justify"
            dangerouslySetInnerHTML={{ __html: comment_set.body }}
          />
        </div>
      </li>
    ));

    return (
      <Fragment>
        <AllCardBody
          BodyId={"issue_feedback_table"}
          cardTitle={this.props.title}
          id={"issue_feedback_card"}
        >
          <div className="row" id="cmnt_table_scroll">
            <div className="col-sm-12">
              {this.props.issue.total_comments > 0 ? (
                <ul id="comments">{comments}</ul>
              ) : (
                <NoData />
              )}
            </div>
          </div>
          <Collapse accordion>
            <Panel header="Add Your Comment Here...">
              <Form onFinish={this.handleSubmit}>
                <TextEditor
                  style={{ backgroundColor: "#ffffff" }}
                  ref={this.getTextEditor}
                  setParentState={this.setValue}
                />
                <br />
                <div style={{ textAlign: "end", paddingRight: "1em" }}>
                  <Button
                    key="submit"
                    htmlType="submit"
                    type="primary"
                    onClick={this.getValue}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </Panel>
          </Collapse>
        </AllCardBody>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { commnentIssue, markasSolution })(
  IssueFeedback
);
