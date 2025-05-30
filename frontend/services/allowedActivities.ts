import api from "../utils/api";

export interface AllowedActivity {
  id: number;
  relationship: number;
  activity_type: string;
  activity_label: string;
  activity_description: string;
  is_allowed: boolean;
  created_at: string;
  patient_name: string;
  patient_email: string;
}

export interface AvailableActivity {
  value: string;
  label: string;
  description: string;
}

export const getAllowedActivitiesByPatient = async (patientId: number): Promise<AllowedActivity[]> => {
  const response = await api.get(`/allowed-activities/by_patient/?patient_id=${patientId}`, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

export const toggleActivity = async (
  patientId: number, 
  activityType: string, 
  isAllowed: boolean
): Promise<AllowedActivity> => {
  const response = await api.post("/allowed-activities/toggle_activity/", {
    patient_id: patientId,
    activity_type: activityType,
    is_allowed: isAllowed
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

export const getAvailableActivities = async (): Promise<AvailableActivity[]> => {
  const response = await api.get("/allowed-activities/available_activities/", {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

export const createAllowedActivity = async (
  relationshipId: number,
  activityType: string,
  isAllowed: boolean = true
): Promise<AllowedActivity> => {
  const response = await api.post("/allowed-activities/", {
    relationship: relationshipId,
    activity_type: activityType,
    is_allowed: isAllowed
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

export const updateAllowedActivity = async (
  activityId: number,
  isAllowed: boolean
): Promise<AllowedActivity> => {
  const response = await api.patch(`/allowed-activities/${activityId}/`, {
    is_allowed: isAllowed
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};