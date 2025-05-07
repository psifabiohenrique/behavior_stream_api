import api from "../utils/api";

export const createClient = async (name: string, email: string, password: string, psychologistId: number = 0) => {
  // Formata os dados como JSON
  const data = {
    "name": name,
    "email": email,
    "password": password,
    "psychologist_id": psychologistId.toString(),
  };

    const response = await api.post("/client", data, {
      headers: {
        "Content-Type": "application/json", // Define o tipo correto como JSON
      },
    });

  return response.data; // Retorna os dados do cliente criado
};


export const getCurrentUser = async () => {
  const response = await api.get("/client", {
    headers: {
      "Content-Type": "application/json",
    }
  })

  let result = {...response.data}
  if (response.data.psychologist_id) {
    const response_psychologist = await getPsychologist(
      {id: response.data.psychologist_id, email: null}
    )
    result.psychologist = response_psychologist.email
  }
  return result
}

export const patchCurrentUser = async (
  name: string | null = null,
  email: string | null = null,
  password: string | null = null,
  psychologist_id: string | null = null
) => {
  const data = {name, email, password, psychologist_id}
  const response = await api.patch("/client", data)
  return response.data
}

export const getPsychologist = async (
  data_received: {id: string | null,  email: string | null}
) => {

  const data = data_received.id !== null ? data_received.id : data_received.email
  if (data == null) {
    return null
  }

  const response = await api.get(`/psychologist`, {
    params: { [data_received.id !== null ? "id" : "email"]: data },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
