import FilterBar from "../components/FilterBar/FilterBar";
import SuggestionCard from "../components/SuggestionCard/SuggestionCard";
export default function HaveARide() {
  return (
    <div className="center-item">
      <h1>HAVE A RIDE?</h1>
      <FilterBar isHaveARide={true}/>
      <SuggestionCard isHaveARide={true}/>
    </div>
  );
}
