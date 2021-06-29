import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ImageSideNav from "../../../Layout/SideNav/ImageSideNav";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import moment from "moment";
import "./SupervisorFeedBack.css";
import { Skeleton } from "antd";

class SupervisorFeedBack extends Component {
  render() {
    if (!this.props.task) {
      return (
        <Fragment>
          <AllCardBody
            BodyId={"issue_feedback_table"}
            cardTitle={this.props.title}
            id={"issue_feedback_card"}
          >
            <br />
            <div className="row" id="cmnt_table_scroll">
              <div className="col-sm-12">
                <Skeleton active loading={true} paragraph={true} />
              </div>
            </div>
          </AllCardBody>
        </Fragment>
      );
    }
    const feedback = this.props.task.feedback_set.map((feedback_set, i) => (
      <li key={i} className="cmmnt">
        <div className="avatar">
          <Link to="/">
            <ImageSideNav
              altname={feedback_set.author_user.full_name}
              id={"comment_logo"}
              srcfile={feedback_set.author_user.image}
              width={"70"}
              height={"70"}
              clsattr="img-circle"
            />
          </Link>
        </div>
        <div className="cmmnt-content">
          <header id="name_feedback">
            <Link to="/" className="userlink">
              {feedback_set.author_user.full_name}
            </Link>
            &nbsp;
            <h6 style={{ display: "inline-block" }}>posted on </h6>-{" "}
            <span className="pubdate">
              {moment(feedback_set.created_date).format(
                "DD MMM, YYYY, h:mm:ss a"
              )}
            </span>
          </header>
          <p
            id="paragraph_justify"
            dangerouslySetInnerHTML={{ __html: feedback_set.body }}
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
          <br />
          <div className="row" id="cmnt_table_scroll">
            <div className="col-sm-12">
              <ul id="feedback">{feedback}</ul>
            </div>
          </div>
        </AllCardBody>
      </Fragment>
    );
  }
}

export default SupervisorFeedBack;
