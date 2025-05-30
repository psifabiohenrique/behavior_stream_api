import { User } from "@/models/user";
import api from "../utils/api";
import { RoleChoices } from "@/models/roleChoices";

export interface Patient {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface Relationship {
  id: number;
  therapist: number;
  patient: number;
  patient_details?: Patient;
}

export const getPatients = async (): Promise<User[]> => {
  const response = await api.get("/users/list_patients/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getRelationships = async (): Promise<Relationship[]> => {
  const response = await api.get("/relationships/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getPatientRelationship = async (
  patientId: number
): Promise<Relationship> => {
  const response = await api.get(`/relationships/${patientId}/`);
  return response.data;
};

export const createRelationship = async (
  patientId: number,
  therapistId: number
): Promise<Relationship> => {
  const data = {
    therapist: therapistId,
    patient: patientId,
  };

  const response = await api.post("/relationships/", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const deleteRelationship = async (
  relationshipId: number
): Promise<void> => {
  await api.delete(`/relationships/${relationshipId}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
