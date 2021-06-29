import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import "./AuthFail.css";

class AuthFail extends React.PureComponent {
  render() {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );
  }
}

export default AuthFail;
