export class Relationship {
    id?: number;
    therapist_id?: number;
    patient_id?: number;

    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.therapist_id = data.therapist_id;
            this.patient_id = data.patient_id;
        }
    }
}