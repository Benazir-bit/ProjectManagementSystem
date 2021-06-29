import React, { Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const AccountsRoute = ({
  component: Component,
  auth,
  password_valid,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (password_valid) {
        //return <PaySlip {...props} />
        return <Component {...props} />;
        //return <Redirect to={{ pathname: '/payslip', state: { ...props } }} />
        //return <PrivateRoute exact path='/payslip' component={PaySlip} />
      } else if (auth.user.is_fna) {
        //return <PaySlip {...props} />
        return <Component {...props} />;
        //return <Redirect to={{ pathname: '/payslip', state: { ...props } }} />
        //return <PrivateRoute exact path='/payslip' component={PaySlip} />
      } else {
        return <Redirect to="/userpayslip" />;
      }
    }}
  />
);

const mapStateToProps = state => ({
  auth: state.auth,
  otp: state.otp,
  password_valid: state.auth.password_valid
});
export default connect(mapStateToProps)(AccountsRoute);
