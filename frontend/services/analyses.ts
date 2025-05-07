import api from "../utils/api";
import {getToken} from "../utils/secureStore"

export const getAnalyses = async () => {

  const response = await api.get("/functional_analysis/");
  return response.data; // Retorna a lista de análises funcionais

};

// Falta implementar essa rota na API
export const getAnalysisById = async (id: string) => {
  const response = await api.get(`/functional_analysis/${id}`);
  return response.data; // Retorna os detalhes de uma análise funcional
};

export const createAnalysis = async (
  title: string,
  date: string,
  antecedent: string,
  behavior: string,
  consequence: string,
  client_id: number = 0
) => {

  const data = {
    title,
    date,
    antecedent,
    behavior,
    consequence,
    client_id
  }

  const response = await api.post("/functional_analysis", data);
  return response.data; // Retorna os dados da análise criada
};

export const updateAnalysis = async (id: string, data: {
  title: string;
  date: string;
  antecedent: string;
  behavior: string;
  consequence: string;
}) => {
  const response = await api.patch(`/functional_analysis/${id}`, data);
  return response.data; // Retorna os dados da análise atualizada
};

export const deleteAnalysis = async (id: string) => {
  const response = await api.delete(`/functional_analysis/${id}`);
  return response.data; // Retorna a confirmação da exclusão
};