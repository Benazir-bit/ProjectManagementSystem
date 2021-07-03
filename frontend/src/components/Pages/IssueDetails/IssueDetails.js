import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getIssueDetails } from "../../../actions/issues";
import { Link } from "react-router-dom";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import IssueCardBody from "../../Common/AllCard/IssueCardBody";
import IssueFeedBack from "./IssueFeedBack/IssueFeedBack";
import TextEditor from "../../Common/TextEditor/TextEditor";
import IssueInfo from "../../Common/DetailCard/IssueInfo";
import IssueDetailCard from "../../Common/DetailCard/IssueDetailCard";
import "./IssueDetails.css";
import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout, Skeleton } from "antd";
const { Content } = Layout;

class IssueDetails extends Component {
  componentDidMount() {
    this.props.getIssueDetails(this.props.match.params.id);
  }
  render() {
    const { issue } = this.props;
    // if (!issue) {
    //   return null;
    // }

    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={issue ? issue.name : null}
                    title_color={"#d9534f"}
                  />
                  <br />
                  <div className="row">
                    <div className="col-sm-12 col-xs-12 col-md-7">
                      <IssueDetailCard detailHead={"Details"} issue={issue} />
                    </div>
                    <div className="col-sm-12 col-xs-12 col-md-5">
                      <IssueInfo issue={issue} />
                    </div>
                  </div>
                  <br />

                  <div className="row">
                    <div className="col-sm-12">
                      {!issue ? (
                        <Skeleton active loading={true} paragraph={true} />
                      ) : (
                        <IssueFeedBack issue={issue} title="All Comments" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* <ActivityList id={this.props.user.id} type={"all"} /> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  issue: state.issues.issue
});

export default connect(mapStateToProps, { getIssueDetails })(IssueDetails);
