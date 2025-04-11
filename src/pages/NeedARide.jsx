import FilterBar from "../components/FilterBar/FilterBar";
import SuggestionCard from "../components/SuggestionCard/SuggestionCard";
export default function NeedARide() {
  return (
    <div className="center-item">
      <h1>NEED A RIDE?</h1>
      <FilterBar isHaveARide={false}/>
      <SuggestionCard />
    </div>
  );
}
