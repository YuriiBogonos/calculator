import { create } from "zustand";
import { Suggestion } from "../types/suggestion";

type Props = {
  suggestion: Suggestion[];
  setSuggestion: (suggestion: Suggestion[]) => void;
};

export const useSuggestionStore = create<Props>((set) => ({
  suggestion: [],
  setSuggestion: (suggestion) => set(() => ({ suggestion: suggestion })),
}));
