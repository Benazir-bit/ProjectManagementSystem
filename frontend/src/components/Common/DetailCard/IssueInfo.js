import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import { Skeleton } from "antd";
import "./DetailCard.css";

class IssueInfo extends Component {
  render() {
    const { issue } = this.props;
    if (!this.props.issue) {
      return (
        <div className="card" id="issueAssignCard">
          <ul className="list-group">
            <li className="list-group-item">
              <Skeleton active loading={true} paragraph={false} />
            </li>
            <li className="list-group-item">
              <Skeleton active loading={true} paragraph={false} />
            </li>
            <li className="list-group-item">
              <Skeleton active loading={true} paragraph={false} />
            </li>
          </ul>
        </div>
      );
    }
    return (
      <Fragment>
        <div className="card" id="issueAssignCard">
          <ul className="list-group">
            {/* <li className="list-group-item">
							<Button type="primary">All</Button>
						</li> */}
            <li className="list-group-item">
              <strong>Project: </strong>&nbsp;
              <Link to={`/project-details/${issue.project}`}>
                {issue.project_name}
              </Link>
            </li>
            <li className="list-group-item">
              <strong>Task: </strong>&nbsp;
              <Link to={`/task-details/${issue.task}`}>{issue.task_name}</Link>
            </li>
            <li className="list-group-item">
              <strong>Raised By: </strong>
              <Link to={`/profile/${issue.raised_by_name.id}`}>
                <ImageSmall
                  clsattr="img-circle"
                  altname={issue.raised_by_name.full_name}
                  srcfile={issue.raised_by_name.image}
                />
              </Link>
              <Link to={`/profile/${issue.raised_by_name.id}`}>
                {issue.raised_by_name.full_name}
              </Link>
            </li>

            <li className="list-group-item">
              <strong>Supervised by: </strong>
              <Link to={`/profile/${issue.supervisor.id}`}>
                <ImageSmall
                  clsattr="img-circle"
                  altname={issue.supervisor.full_name}
                  srcfile={issue.supervisor.image}
                />
              </Link>
              <Link to={`/profile/${issue.supervisor.id}`}>
                {issue.supervisor.full_name}
              </Link>
            </li>
            <li className="list-group-item">
              <strong>Raised Date:</strong>&nbsp;
              {issue.raised_date}
            </li>
            <li className="list-group-item">
              <strong>Status: </strong>&nbsp;
              {issue.solved ? "Solved" : "Unresolved"}
            </li>
            {issue.solved ? (
              <Fragment>
                <li className="list-group-item">
                  <strong>Solved Date:</strong>&nbsp;
                  {issue.solved_date}
                </li>
                <li className="list-group-item">
                  <strong>Solved By:</strong>&nbsp;
                  <Link to={`/profile/${issue.solved_by_name.id}`}>
                    <ImageSmall
                      clsattr="img-circle"
                      altname={issue.solved_by_name.full_name}
                      srcfile={issue.solved_by_name.image}
                    />
                  </Link>
                  <Link to={`/profile/${issue.solved_by_name.id}`}>
                    {issue.solved_by_name.full_name}
                  </Link>
                </li>
              </Fragment>
            ) : null}
          </ul>
        </div>
      </Fragment>
    );
  }
}
export default IssueInfo;
