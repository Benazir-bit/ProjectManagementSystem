import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
//import AllCardBody from '../../Common/AllCard/AllCardBody';
import JobDetailCard from "../../Common/JobDetailCard/JobDetailCard";

//import TaskIssueTable from "../../Common/AllTables/TaskIssueTable";


class JobTitle extends Component {
    render() {
        return (
            <Fragment>
                <div className="col-sm-11" id="base-main-body">
                    <div className="row">
                        <div className="col-sm-12">
                            <div id="main-body-div">
                                <br />
                                <TitleHeader title={"Job Title & Description"} title_color={"#337ab7"} />
                                <br />
                            </div>
                            <div>
                                <div className="row" id="card_member">
                                    <div class="col-lg-4 col-md-12">
                                        <JobDetailCard JobTitle={"AMS Verification"} />
                                    </div>
                                    <div class="col-lg-4 col-md-12">
                                        <JobDetailCard JobTitle={"Digital Verification"} />
                                    </div>
                                    <div class="col-lg-4 col-md-12">
                                        <JobDetailCard JobTitle={"Circuit Design"} />
                                    </div>
                                </div>
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default JobTitle;
