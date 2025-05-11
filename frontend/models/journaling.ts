import { format } from "date-fns";

export class Journaling {
    id?: number;
    title?: string;
    resume?: string;
    date?: string;
    patient?: number;
    is_active?: boolean;

    situation?: string;
    emotions?: string;
    thoughts?: string;
    body_feelings?: string;
    behavior?: string;
    consequences?: string;
    evidence_favorable?: string;
    evidence_unfavorable?: string;
    alternative_thoughts?: string;
    alternative_behaviors?: string;

    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.title = data.title;
            this.resume = data.resume;
            this.date = format(data.date, "YYYY-MM-DD");
            this.patient = data.patient;
            this.is_active = data.is_active;
            this.situation = data.situation;
            this.emotions = data.emotions;
            this.thoughts = data.thoughts;
            this.body_feelings = data.body_feelings;
            this.behavior = data.behavior;
            this.consequences = data.consequences;
            this.evidence_favorable = data.evidence_favorable;
            this.evidence_unfavorable = data.evidence_unfavorable;
            this.alternative_thoughts = data.alternative_thoughts;
            this.alternative_behaviors = data.alternative_behaviors;
        }
    }
}