import { useState } from "react";
import InnerCard from "../InnerCard/InnerCard";
import "./filter-bar.css";
export default function FilterBar({ isHaveARide }) {
  const [isFilter, setIsFilter] = useState(false); //used to start filtering
  var filterResult = [
    {
      fname: "Jon", 
      lname: "Doe",
      from: "Boston",
      to: "UMass",
      date: "Sunday 3/23/25",
      time: "Morning",
    },

    {
      fname: "Rio",
      lname: "Futaba",
      from: "UMass",
      to: "Logan Airport",
      date: "Thursday 4/10/25",
      time: "All day",
    },

    {
      fname: "Mister",
      lname: "Petey",
      from: "UMass",
      to: "Smith College",
      date: "Thursday 4/10/25",
      time: "Afternoon",
    },
  ]; //make up filter result for testing, will add backend

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsFilter(true); // Update state
  };

  return (
    <div className="flex-container-filter">
      <form className="filter-container small-font" onSubmit={handleSubmit}>
        <div>
          <label for="place-from">From</label>
          <input type="text" id="place-from" name="place-from" />
        </div>
        <div>
          <label for="place-to">to</label>
          <input type="text" id="place-to" name="place-to" />
        </div>
        <div>
          <label for="place-from">Date</label>
          <input type="date" id="date-from" name="date-from" />
        </div>
        <div>
          <label for="date-to">to</label>
          <input type="date" id="date-to" name="date-to" />
        </div>

        <input type="submit" value="Filter" />
      </form>

      {/* <div className={`filter-result ${isFilter? "active" : ""}`}> */}
      <div className="filter-result active">
        {filterResult.map((result) => (
          //printing each filter result
          <InnerCard
            fname={result.fname}
            lname={result.lname}
            from={result.from}
            to={result.to}
            date={result.date}
            time={result.time}
            isHaveARide={isHaveARide}
          />
        ))}
      </div>
    </div>
  );
}
