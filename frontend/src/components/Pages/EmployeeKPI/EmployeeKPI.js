import React, { Component, Fragment } from "react";
import AllCardBody from "../../Common/AllCard/AllCardBody";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import KpiProfile from "./KpiProfile/KpiProfile";
import NoData from "../../Common/NoData/NoData";
import "./EmployeeKPI.css";
import ProfileKpi from "./ProfileKpi/ProfileKpi";
import { connect } from "react-redux";
import { getEmployeeYearlyKPI } from "../../../actions/kpi";
import { getUserAvgKPI } from "../../../actions/profile";
import KpiSliderModal from "../../Common/Modals/KpiSliderModal/KpiSliderModal";
import CommonTable from "../../Common/AllTables/CommonTable";
import TableProgress from "../../Common/AllTables/TableProgress";
import moment from "moment";
import { Link } from "react-router-dom";
import { Select, Skeleton } from "antd";
// import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout } from "antd";
const { Content } = Layout;
let today = new Date();
let year = today.getFullYear();
class EmployeeKPI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      year: year
    };
  }
  componentDidMount() {
    this.props.getEmployeeYearlyKPI(this.props.match.params.id, year);
    this.props.getUserAvgKPI(this.props.match.params.id, year);
    this.setState({
      fetchingData: true
    });
  }

  componentWillReceiveProps() {
    this.setState({
      fetchingData: false
    });
  }
  selectOption = value => {
    this.setState({
      year: value
    });
    this.props.getEmployeeYearlyKPI(this.props.match.params.id, value);
    this.props.getUserAvgKPI(this.props.match.params.id, value);
  };
  render() {
    console.log(this.props.kpis, "all");
    if (!this.props.kpis) {
      return null;
    }

    const fetchingData = this.state.fetchingData;
    let kpitast_list = [];
    {
      this.props.kpis.kpis.map(kpi => {
        let kpitast_object = {
          "Task Title": (
            <Skeleton active loading={fetchingData} paragraph={false}>
              <Link to={`/task-details/${kpi.task_id}`}>{kpi.task_name}</Link>
            </Skeleton>
          ),
          "Rated On": (
            <Skeleton active loading={fetchingData} paragraph={false}>
              {moment(kpi.created).format("DD MMM, YYYY")}
            </Skeleton>
          ),
          Performance: (
            <Skeleton active loading={fetchingData} paragraph={false}>
              <TableProgress percent={kpi.average} />
            </Skeleton>
          ),
          "": (
            <Skeleton active loading={fetchingData} paragraph={false}>
              <KpiSliderModal kpiId={kpi.id} btnname={"Details"} />
            </Skeleton>
          )
        };
        kpitast_list.push(kpitast_object);
      });
    }

    var tableData = {
      columns: ["Task Title", "Rated On", "Performance", ""],
      rows: kpitast_list
    };

    const yearList = this.props.kpis.year_list.map((year, i) => (
      <Select.Option key={i} value={year}>
        {year}
      </Select.Option>
    ));
    const yearFilter = (
      <Select defaultValue={year} onChange={this.selectOption}>
        {yearList}
      </Select>
    );
    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader title="KPI" title_color={"#337ab7"} />
                  <div className="col-sm-12 col-xs-12 col-md-12 col-lg-3">
                    <AllCardBody BodyId={"userKPICard"} cardTitle={"Overview"}>
                      <div>
                        <KpiProfile
                          user={this.props.kpis.user}
                          projects={this.props.kpis.assisted_projects}
                          tasks={this.props.kpis.completed_tasks}
                          raised_issues={this.props.kpis.raised_issues}
                          solved_issues={this.props.kpis.solved_issues}
                          yearFilter={yearFilter}
                        />
                      </div>
                    </AllCardBody>
                  </div>

                  <div className="col-sm-12 col-xs-12 col-md-12 col-lg-9">
                    <AllCardBody
                      BodyId={"userKPICard"}
                      cardTitle={"Average Ratings"}
                    >
                      {this.props.kpis.kpis.length === 0 ? (
                        <NoData />
                      ) : (
                        <ProfileKpi avg_kpi={this.props.avg_kpi} />
                      )}
                    </AllCardBody>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <AllCardBody
                    BodyId={"userKPICard"}
                    cardTitle={"KPI Distribution"}
                  >
                    {this.props.kpis.kpis.length === 0 ? (
                      <NoData />
                    ) : (
                      <CommonTable
                        clsattr={"table issueTable"}
                        data={tableData}
                        class_div={"issuetab"}
                      />
                      // <UserKpiTable kpis={this.props.kpis.kpis} />
                    )}
                  </AllCardBody>
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* <ActivityList id={this.props.match.params.id} type={"all"} /> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  kpis: state.kpi.kpis,
  avg_kpi: state.profile.avg_kpi
});

export default connect(mapStateToProps, {
  getEmployeeYearlyKPI,
  getUserAvgKPI
})(EmployeeKPI);
