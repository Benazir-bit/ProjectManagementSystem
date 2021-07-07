import React, { Fragment } from "react";
import "./CircleProgress.css";
class CircleProgress extends React.PureComponent {
  componentDidMount() {
    this.pieAnimate(this.props.avg_kpi);
  }
  componentDidUpdate() {
    this.pieAnimate(this.props.avg_kpi);
  }
  pieAnimate(spinPecent) {
    var counter = document.getElementById("counter").getContext("2d");
    var no = 0; // Starting Point
    var pointToFill = 4.72; //Point from where you want to fill the circle
    var cw = counter.canvas.width; //Return canvas width
    var ch = counter.canvas.height; //Return canvas height
    var diff; // find the different between current value (no) and trageted value (100)

    function fillCounter() {
      diff = (no / 100) * Math.PI * 2 * 10;

      counter.clearRect(0, 0, cw, ch); // Clear canvas every time when function is call

      counter.lineWidth = 10; // size of stroke

      counter.fillStyle = "000000"; // color that you want to fill in counter/circle

      counter.strokeStyle = "#337ab7"; // Stroke Color

      counter.textAlign = "center";

      counter.font = "25px monospace"; //set font size and face

      counter.fillText(no.toFixed(2) + "%", 100, 110); //fillText(text,x,y);

      counter.beginPath();
      counter.arc(100, 100, 90, pointToFill, diff / 10 + pointToFill); //arc(x,y,radius,start,stop)

      counter.stroke(); // to fill stroke

      // now add condition

      if (no >= spinPecent) {
        clearTimeout(fill); //fill is a variable that call the function fillcounter()
      }
      var diff_new = spinPecent - no;
      if (diff_new > 0.1) {
        no = no + 0.1;
      } else {
        no = no + diff_new;
      }
    }

    //now call the function
    var fill = setInterval(fillCounter, 1);
  }


  render() {
    if (!this.props.avg_kpi) {
      return null
    }
    return (
      <Fragment>
        <div id="circle1" />
        <div id="shadowring" />
        <div id="circle2" />
        <canvas height="200" width="200" id="counter" />
      </Fragment>
    );
  }
}

export default CircleProgress;
