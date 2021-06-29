import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Slider, InputNumber, Row, Col } from "antd";
import "./SliderKPI.css";
class SliderKPI extends React.Component {
  state = {
    inputValue: 0
  };

  onChange = value => {
    if (Number.isNaN(value)) {
      return;
    }
    this.setState({
      inputValue: value
    });
  };

  render() {
    const { inputValue } = this.state;
    return (
      <Fragment>
        <h5 id={"categoryHead"}>
          <b>{this.props.category}&nbsp;(10)</b>
        </h5>
        <Row>
          <Col xs={{ span: 16 }} id={"SliderSlide"}>
            <Slider
              min={0}
              max={10}
              readOnly
              //onChange={this.onChange}
              //value={typeof inputValue === "number" ? inputValuee : 0}
              value={parseFloat(this.props.value)}
              step={0.5}
            />
          </Col>
          <Col xs={{ span: 4 }} id={"SliderInput"}>
            <InputNumber
              min={0}
              max={10}
              step={0.5}
              value={parseFloat(this.props.value)}
              onChange={this.onChange}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default SliderKPI;
