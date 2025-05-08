import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchMovieDetails = async (guid) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/movie/${encodeURIComponent(guid)}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar detalhes do filme");
  }
};

export const fetchMovieCredits = async (guid) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/movie/${encodeURIComponent(guid)}/credits`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar créditos do filme");
  }
};
