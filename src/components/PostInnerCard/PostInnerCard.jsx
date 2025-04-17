import "./post-inner-card.css";
import SmallProfile from "../SmallProfile/SmallProfile";
import { CalendarIcon, ClockIcon, LocationIcon, MoneyIcon } from "../Icons";
import TimeDropdown from "../TimeDropDown";
import { useUser } from "../../context/UserContext";
export default function PostInnerCard(props) {
  const { user } = useUser();
  const name = user.displayName;

  var isHaveARide = props.isHaveARide;

  return (
    <div className="post-inner-container">
      <SmallProfile name={name} />

      <div className="flex-container-column align-center">
        <div className="big-font">
          {name} {isHaveARide ? "has a ride!" : "is looking for a ride!"}
        </div>
        <hr />
        <div className="">
          <form className="post-form small-font flex-container-column">
            <div className="form-grid">
              <label for="place-from">
                <LocationIcon />
              </label>
              <input
                type="text"
                id="place-from"
                name="place-from"
                placeholder="location"
                className="post-input"
              />
              <label for="place-to">to</label>
              <input
                type="text"
                id="place-to"
                name="place-to"
                placeholder="location"
                className="post-input"
              />
            </div>

            <div className="form-grid">
              <label for="date-from">
                <CalendarIcon />
              </label>
              <input
                type="date"
                id="date-from"
                name="date-from"
                className="post-input"
              />
              <label for="date-to">to</label>
              <input
                type="date"
                id="date-to"
                name="date-to"
                className="post-input"
              />
            </div>

            <div className="form-grid">
              <label for="time-from">
                <ClockIcon />
              </label>
              <TimeDropdown />
              <label for="date-to">to</label>
              <TimeDropdown />
            </div>

            <div className="form-grid">
              <label for="money-from">
                <MoneyIcon />
              </label>

              <input
                type="text"
                id="place-from"
                name="place-from"
                placeholder="min"
                className="post-input"
              />
              <label for="place-to">to</label>
              <input
                type="text"
                id="place-to"
                name="place-to"
                placeholder="max"
                className="post-input"
              />
            </div>
            <input type="submit" value="Publish!" className="red-button " />
          </form>
        </div>
      </div>
    </div>
  );
}
