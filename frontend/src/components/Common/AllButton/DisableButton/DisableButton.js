import React from "react";
// import ReactDOM from "react-dom";

import { Popover, Button } from "antd";

class DisableButton extends React.Component {
  state = {
    clicked: false,
    hovered: false
  };

  hide = () => {
    this.setState({
      clicked: false,
      hovered: false
    });
  };

  handleHoverChange = visible => {
    this.setState({
      hovered: visible,
      clicked: false
    });
  };

  handleClickChange = visible => {
    this.setState({
      clicked: visible,
      hovered: false
    });
  };

  render() {
    const hoverContent = (
      <div>
        You have unresolved issue. You are not permitted for submission until
        all the issue are solved.
      </div>
    );
    // const clickContent = <div>This is click content.</div>;
    return (
      <Popover
        style={{ width: 500 }}
        content={hoverContent}
        title="Warning"
        trigger="hover"
        visible={this.state.hovered}
        onVisibleChange={this.handleHoverChange}
      >
        <Popover
          content={hoverContent}
          title="Warning"
          trigger="click"
          visible={this.state.clicked}
          onVisibleChange={this.handleClickChange}
        >
          <Button type="primary" disabled>
            {this.props.btnName}
          </Button>
        </Popover>
      </Popover>
    );
  }
}

export default DisableButton;
