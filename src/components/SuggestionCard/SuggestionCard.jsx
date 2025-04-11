import "./suggestion-card-styles.css";

export default function SuggestionCard(props) {
  const isHaveARide = props.isHaveARide;
  var customDisplay = isHaveARide
    ? {
        question: "Looking for a ride instead?",
        link: "/need-a-ride",
        message: "Check Driver Posts!",
      }
    : {
        question: "Looking to give a ride instead?",
        link: "have-a-ride",
        message: "Check Rider Posts!",
      };

  return (
    <div className="flex-container">
      <div className="flex-container-column ">
        <div className="big-font small-width">Nothing would work?</div>
        <div>
          <a href="/make-a-post">
            <button className="white-button square-button small-font">
              Make A Post!
            </button>
          </a>
        </div>
      </div>
      <div className="flex-container-column ">
        <div className="big-font small-width">{customDisplay.question}</div>
        <div>
          <a href={customDisplay.link}>
            <button className="white-button small-font square-button">
              {customDisplay.message}
            </button>
          </a>
        </div>
      </div>{" "}
    </div>
  );
}
