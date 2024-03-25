import { useQuery } from "react-query";
import { getSuggestionList } from "./services/api";
import { useEffect } from "react";
import { useSuggestionStore } from "./store/useSuggestion";
import { CustomFormulaInput } from "./components/CustomFormulaInput/CustomFormulaInput";

const App = () => {
  const { data, isLoading, isError } = useQuery(
    "suggestionList",
    getSuggestionList
  );
  const { setSuggestion } = useSuggestionStore();

  useEffect(() => {
    if (data) {
      setSuggestion(data);
    }
  }, [data, setSuggestion]);
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching suggestion list</div>;

  return (
    <div>
      <CustomFormulaInput />
    </div>
  );
};

export default App;
