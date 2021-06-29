import React, { Component, Fragment } from "react";
// import "babel-polyfill";
import { Provider } from "react-redux";
import store from "../store";
import "./App.css";
import Profile from "./Pages/Home/Home";
import SignIn from "./Pages/SignIn/SignIn";
import TopNav from "./Layout/TopNav/TopNav";
import SideNav from "./Layout/SideNav/SideNav";
import EmployeeProfile from "./Pages/EmployeeProfile/EmployeeProfile";
import GroupDetails from "./Pages/GroupDetails/GroupDetails";
import AllProjects from "./Pages/AllProjects/AllProjects";
import Tasks from "./Pages/Tasks/Tasks";
import TaskDetails from "./Pages/TaskDetails/TaskDetails";
import ProjectDetails from "./Pages/ProjectDetails/ProjectDetails";
import CompletedTasks from "./Pages/CompletedTasks/CompletedTasks";
import ContactUs from "./Pages/ContactUs/ContactUs";
import Dashboard from "./Pages/Dashboard/Dashboard";
import WeeklyStatusReport from "./Pages/WeeklyStatusReport/WeeklyStatusReport";
import ViewAll from "./Common/ViewAll/ViewAll";
import WeeklyReportSummary from "./Pages/WeeklyReportSummary/WeeklyReportSummary";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import PrivateRoute from "./Common/PrivateRoute";
import { loadUser } from "../actions/auth";
import GroupIssues from "./Pages/Issues/GroupIssues";
import AllMembers from "./Pages/AllMembers/AllMembers";
import RaisedIssues from "./Pages/Issues/RaisedIssues";
import IssueDetails from "./Pages/IssueDetails/IssueDetails";
import JobTitle from "./Pages/JobTitle/JobTitle";
import EmployeeKPI from "./Pages/EmployeeKPI/EmployeeKPI";
import NoData from "./Common/NoData/NoData";
import Page404 from "./Common/404Page/404Page";
import ManageGroups from "./Pages/ManageGroups/ManageGroups";
import SolvedIssues from "./Pages/Issues/SolvedIssues";
// import CreateUser from "./Pages/CreateUser/CreateUser";
// import ActivityList from "./Layout/ActivityList/ActivityList";
// import { Provider as AlertProvider } from "react-alert";
// import Alerts from "./Common/Alerts/Alerts";
import Invalid from "./Common/Error/Invalid";
import AuthFail from "./Layout/AuthFail/AuthFail";
import { Drawer, Button, Icon, Layout, Spin } from "antd";
// import OnBoardNotice from "./Pages/NoticePage/OnBoardNotice/OnBoardNotice";
// import AllNoticeList from "./Pages/NoticePage/AllNoticeList/AllNoticeList";
// import NoticeDetails from "./Pages/NoticePage/NoticeDetails/NoticeDetails";
// import Chat from "./Pages/Chat/Chat";
import { any } from "prop-types";
// import Summary from "./Pages/Summary/Summary";
// import WeeklyReportList from "./Pages/Email/Email";


import { validateOtpCheck } from "../actions/otp";

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    store.dispatch(loadUser());
    store.dispatch(validateOtpCheck());
  }

  render() {
    let management = this.props.user ? this.props.user.groups.map(grp => {
      return grp.name == "Core Director" ? true : false;
    }) : null;
    let appRoutes = (
      <Switch>
        <Route exact path="/login" component={SignIn} />
        <PrivateRoute component={Page404} />
      </Switch>
    );

    if (this.props.user) {
      if (this.props.user.is_hr) {
        appRoutes = (
          <Switch>
            <Route exact path="/login" component={SignIn} />

            {/* <PrivateRoute
              exact
              path="/profile/:id"
              component={EmployeeProfile}
            /> */}


            <PrivateRoute exact path="/invalid" component={Invalid} />


            <PrivateRoute exact path="/access-denied/" component={AuthFail} />



            <PrivateRoute component={Page404} />
          </Switch>
        );
      } else if (this.props.user.is_fna) {
        appRoutes = (
          <Switch>
            <Route exact path="/login" component={SignIn} />

            {/* <PrivateRoute
              exact
              path="/profile/:id"
              component={EmployeeProfile}
            /> */}
            {/* Commoun Routes */}
            {/* Off For Appraisal <PrivateRoute
              exact
              path="/kpi-details/:id"
              component={EmployeeKPI}
            /> */}
            <PrivateRoute exact path="/nodata" component={NoData} />
            {/* Off For Appraisal  <PrivateRoute exact path="/requisition" component={Requisition} /> */}


            <PrivateRoute exact path="/invalid" component={Invalid} />

            <PrivateRoute exact path="/access-denied/" component={AuthFail} />

            <PrivateRoute component={Page404} />
          </Switch>
        );
      } else if (management) {
        appRoutes = (
          <Switch>
            <Route exact path="/login" component={SignIn} />

            <PrivateRoute component={Page404} />
          </Switch>
        );
      } else {
        appRoutes = (
          <Switch>
            <Route exact path="/login" component={SignIn} />
            {/* Off For Appraisal <PrivateRoute
              exact
              path="/userpayslip"
              component={UserPayslipView}
            />
            <PrivateRoute exact path="/summary" component={Summary} />
            <PrivateRoute
              exact
              path="/weeklyreportsummary/:id"
              component={WeeklyReportSummary}
            />
            <PrivateRoute
              exact
              path="/weeklyreportlist/:type"
              component={WeeklyReportList}
            />
            <PrivateRoute
              exact
              path="/all_news/:type/:id"
              component={ViewAll}
            />
            <PrivateRoute exact path="/group/:id" component={GroupDetails} />
            <PrivateRoute
              exact
              path="/:type/projects/:filter/:id"
              component={AllProjects}
            />
            <PrivateRoute
              exact
              path="/user/tasks/current/:id"
              component={Tasks}
            />
            <PrivateRoute
              path="/project-details/:id"
              component={ProjectDetails}
            />
            <PrivateRoute
              exact
              path="/task-details/:id"
              component={TaskDetails}
            />
            <PrivateRoute
              exact
              path="/completedtasks/:id"
              component={CompletedTasks}
            />
            <PrivateRoute
              exact
              path="/all-issues/:id"
              component={IssueDetails}
            />
            <PrivateRoute
              exact
              path="/group-issues/:type/:id"
              component={GroupIssues}
            />
            <PrivateRoute
              exact
              path="/raised-issues/:id"
              component={RaisedIssues}
            />
            <PrivateRoute
              exact
              path="/solved-issues/:id"
              component={SolvedIssues}
            />
            <PrivateRoute
              exact
              path="/issue-details/:id"
              component={IssueDetails}
            />
            <PrivateRoute exact path="/" component={Dashboard} /> */}
            {/* <PrivateRoute
              exact
              path="/profile/:id"
              component={EmployeeProfile}
            /> */}
            {/* Commoun Routes */}
            {/* Off For Appraisal <PrivateRoute
              exact
              path="/kpi-details/:id"
              component={EmployeeKPI}
            /> */}
            <PrivateRoute exact path="/nodata" component={NoData} />
            {/* Off For Appraisal <PrivateRoute exact path="/requisition" component={Requisition} /> */}

            {/* Common For All */}
            {/* Off For Appraisal <PrivateRoute
              exact
              path="/config-working-hour/"
              component={ConfigWorkingHourPage}
            />
            <PrivateRoute
              exact
              path="/my-attendance/"
              component={UserAttendancePage}
            />
            <PrivateRoute
              exact
              path="/group-attendance/"
              component={GroupAttendancePage}
            />
            <PrivateRoute
              exact
              path="/user-attendance"
              component={UserAttendancePage}
            />
            <PrivateRoute exact path="/holidays/" component={Holidays} />
            <PrivateRoute exact path="/otpinput" component={OtpInput} />
            <AccountsRoute exact path="/payslip" component={PaySlip} /> 
            <PrivateRoute exact path="/contactus/:id" component={ContactUs} />*/}
            <PrivateRoute exact path="/invalid" component={Invalid} />
            {/* Off For Appraisal <PrivateRoute exact path="/myaccount/" component={MyAccount} />
            <PrivateRoute
              exact
              path="/weeklystatusreport"
              component={WeeklyStatusReport}
            />
            <PrivateRoute exact path="/access-denied/" component={AuthFail} />

            <PrivateRoute exact path="/all-services/" component={AllServices} />
            <PrivateRoute
              exact
              path="/request-services/"
              component={RequestServices}
            />
            <PrivateRoute
              exact
              path="/service/:name"
              component={AllServiceForm}
            />
            <PrivateRoute
              exact
              path="/services-users/"
              component={MyServices}
            />
            <PrivateRoute
              exact
              path="/my-providentfund/"
              component={MyProvidentFund}
            />
            <PrivateRoute exact path="/user-loans/" component={LoanUser} />
            <PrivateRoute
              exact
              path="/request-providentfund/"
              component={RequestProvidentFund}
            />
            <PrivateRoute
              exact
              path="/notices/allnotice/"
              component={AllNoticeList}
            />
            <PrivateRoute
              path="/notice-details/:id"
              component={NoticeDetails}
            /> */}


            {/* Off For Appraisal <PrivateRoute path="/chat/" component={Chat} /> */}

            <PrivateRoute component={Page404} />
          </Switch>
        );
      }
    }

    return (
      <Router>
        <Fragment>
          <TopNav />
          <div>
            {/* <Alerts /> */}
          </div>
          <Layout
            className={"MainLayout"}
            style={{
              backgroundColor: "transparent",
              height: "-webkit-fill-available"
            }}
          >
            <SideNav />
            {appRoutes}
          </Layout>
        </Fragment>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(App);
