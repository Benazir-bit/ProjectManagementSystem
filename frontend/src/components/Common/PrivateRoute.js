import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "./Spinner/Spinner";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (auth.isLoading) {
        console.log("11111")
        return <Spinner />;
      } else if (auth.isAuthenticated) {
        console.log("222222")
        return <Component {...props} />;
      } else {
        console.log("3333")
        return <Redirect to="/login" />;
      }
    }}
  />
);

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
