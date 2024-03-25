import axios from "axios";

import { Suggestion } from "../types/suggestion";

const BASE_URL = "https://652f91320b8d8ddac0b2b62b.mockapi.io/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const getSuggestionList = async () => {
  return (await axiosInstance.get<Suggestion[]>("autocomplete")).data;
};
