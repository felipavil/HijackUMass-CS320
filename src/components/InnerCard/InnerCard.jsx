import "./inner-card-styles.css";
import SmallProfile from "../SmallProfile/SmallProfile";
import { LocationIcon, CalendarIcon, ClockIcon } from "../Icons";

export default function InnerCard(props) {
  var fname = props.fname;
  var name = props.fname + " " + props.lname;
  var from = props.from;
  var to = props.to;
  var date = props.date;
  var time = props.time;
  var isHaveARide = props.isHaveARide;

  return (
    <div className="outer-container inner-card">
      <SmallProfile name={name} />

      <div className="flex-container-column align-center">
        <div className="big-font">
          {name} {isHaveARide ? "is looking for a ride!" : "has a ride!"}
        </div>
        <hr />
        <div className="grid-container">
          <LocationIcon />
          {from} to {to}
          <CalendarIcon />
          {date}
          <ClockIcon />
          {time}
        </div>
      </div>
      <div className="align-right">
        <button className="white-button">Chat with {fname}!</button>
      </div>
    </div>
  );
}
