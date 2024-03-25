import React, { useEffect, useState } from "react";
import { useSuggestionStore } from "../../store/useSuggestion";
import { TTag, useTagStore } from "../../store/useTag";
import { Suggestion } from "../../types/suggestion";

export const CustomFormulaInput = () => {
  const { suggestion } = useSuggestionStore();
  const { tags, addTag, updateTag, removeTag } = useTagStore();
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [operators, setOperators] = useState<string[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (suggestion) {
      setFilteredSuggestions(
        suggestion.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, suggestion]);

  const handleAddTag = (item: TTag) => {
    addTag(item);
    setSearchQuery("");
    setErrorMessage(null);
  };

  const handleMainInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchQuery(text);
    setErrorMessage(null);
    if (tags.length > operators.length && text.length === 0) {
      setOperators(prev => prev.slice(0, prev.length - 1));
    }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (searchQuery.length > 0) {
        return;
      } else if (tags.length) {
        if (tags.length === operators.length) {
          setOperators(prev => prev.slice(0, prev.length - 1));
        } else {
          removeTag(tags.length - 1);
        }
      }
    }
    if (e.key === "Enter" && tags.length > operators.length) {
      if (/^[+\-*^/%()]*$/.test(searchQuery)) {
        setOperators(prev => [...prev, searchQuery]);
        setSearchQuery("");
        setErrorMessage(null);
      }
    }
  };

  const evaluateExpression = (expression: string) => {
    try {
      return Function(`return (${expression})`)();
    } catch (error) {
      console.error(error);
      throw new Error("Error, check your expression!");
    }
  };

  const handleResult = () => {
    setErrorMessage(null);
    let expression = "";
    for (let i = 0; i < tags.length; i++) {
      expression += tags[i].value;
      if (operators[i]) {
        expression += operators[i] === "^" ? "**" : operators[i];
      }
    }

    if (/[(+\-*^/%]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }

    try {
      expression = expression.replace(/%/g, "/100");
      setResult(evaluateExpression(expression));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div className="flex justify-center align-middle">
        <div className="grow flex flex-wrap items-center bg-zinc-100 border p-2 relative">
          {tags.map((item: TTag, index: number) => (
            <div key={index} className="flex items-center bg-gray-100 my-2 bg-slate-200">
              <button
                onClick={() => removeTag(index)}
                className="p-1 text-gray-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors duration-300"
              >
                <div className="text-gray-700">{item.category}:</div>
                <div className="ml-2 text-gray-700">{item.title}</div>
              </button>
              =
              <div className="w-px h-6 mx-2" />
              <input
                autoFocus
                placeholder="Value"
                className="w-10 outline-none text-gray-700 bg-slate-200 rd"
                value={item.value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (/^\d*\.?\d*$/.test(newValue)) {
                    updateTag(index, { ...item, value: +newValue });
                  }
                }}
              />
              {operators[index] && (
                <div className="mx-2 text-xl font-bold text-gray-700">
                  {operators[index]}
                </div>
              )}
            </div>
          ))}

          <input
            autoFocus
            placeholder={
              tags.length === operators.length
                ? "Enter Tag"
                : "Enter Operator"
            }
            className="grow bg-transparent rounded-lg py-2 px-4 outline-none"
            value={searchQuery}
            onChange={handleMainInput}
            onKeyDown={handleBackspace}
          />
          {searchQuery.length > 0 &&
            filteredSuggestions.length > 0 &&
            tags.length === operators.length && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 shadow-md rounded-b-md z-10">
                {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    className="block w-full py-2 px-4 text-left hover:bg-gray-100"
                    onClick={() =>
                      handleAddTag({
                        title: suggestion.name,
                        value: suggestion.value,
                        category: suggestion.category
                      })
                    }
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            )}
        </div>

        <button
          className="p-2 px-5 font-bold  bg-green-500 text-white"
          onClick={handleResult}
        >
          Calculate
        </button>
      </div>
      <div className="text-right w-full">{result}</div>
      <div className="text-right w-full text-red-500 font-bold text-xl">
        {errorMessage}
      </div>
    </>
  );
};
