import { Journaling } from "@/models/journaling";
import api from "../utils/api";
import {getToken} from "../utils/secureStore"

export const getJournaling = async () => {

  const response = await api.get("/activities/journaling/");
  return response.data; // Retorna a lista de análises funcionais

};

// Falta implementar essa rota na API
export const getJournalingById = async (id: string) => {
  const response = await api.get(`/activities/journaling/${id}`);
  return response.data; // Retorna os detalhes de uma análise funcional
};

export const createJournaling = async (data: Journaling) => {
  const response = await api.post("/activities/journaling", data);
  return response.data; // Retorna os dados da análise criada
};

export const patchJournaling = async (id: string, data: Journaling) => {
  const response = await api.patch(`/activities/journaling/${id}`, data);
  return response.data; // Retorna os dados da análise atualizada
};

export const deleteJournaling = async (id: string) => {
  const response = await api.delete(`/activities/journaling/${id}`);
  return response.data; // Retorna a confirmação da exclusão
};