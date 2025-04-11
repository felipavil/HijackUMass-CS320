import { FullStar, HalfStar, EmptyStar } from "../Icons";

import "./star-rating.css";

export default function StarRating(props) {
  //calculating stars and display
  var star = Math.floor(Number(props.star));
  var remain = Math.round((Number(props.star) % 1) * 2);
  if (remain === 2) {
    star++;
    remain = 0;
  }
  var starArr = [];
  for (var i = 0; i < 5; i++) {
    starArr.push(star-- > 0 ? 1 : remain-- > 0 ? 0.5 : 0);
  }
  return (
    <div className="stars">
      {starArr.map((e) =>
        e === 1 ? <FullStar /> : e === 0.5 ? <HalfStar /> : <EmptyStar />
      )}
    </div>
  );
}
