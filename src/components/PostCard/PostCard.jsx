import { useState } from "react";
import { useUser } from "../../context/UserContext";
import "./post-card-styles.css";

import PostInnerCard from "../PostInnerCard/PostInnerCard";
export default function PostCard() {
  var [postType, setPostType] = useState("have");

  const handleChange = (e) => {
    setPostType(e.target.value);
  };
  //   const handleSubmit = (e) => {
  //     e.preventDefault(); // Prevent page refresh
  //   };

  return (
    <div className="flex-container-filter align-center">
      <div className="filter-container small-font post-card-container">
        I
        <select value={postType} onChange={handleChange}>
          <option value="have">HAVE</option>
          <option value="need">NEED</option>
        </select>
        A RIDE
      </div>

      <PostInnerCard isHaveARide={postType === "have"}/>
    </div>
  );
}
