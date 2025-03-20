import {QuestionResponse} from "../model/question.ts";

const USER_STORAGE_KEY = "USER_DATA_QUESTIONS";
const USER_PROBLEM_STORAGE_KEY = "USER_PROBLEM";
const PERSONA_ID_KEY = "PERSONA_ID";

export const storeUserResponses = (data: QuestionResponse[]) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
}

export const retrieveUserProfile = (): QuestionResponse[] => {
    const savedData = localStorage.getItem(USER_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
}

export const storePersonaId = (id: number) => {
    localStorage.setItem(PERSONA_ID_KEY, id.toString());
}


export const retrievePersonaId = () => {
    return +(localStorage.getItem(PERSONA_ID_KEY) ?? '0');
}


export const storeUserProblem = (problem: string) => {
    localStorage.setItem(USER_PROBLEM_STORAGE_KEY, problem);
}

export const retrieveUserProblem = () => {
    return localStorage.getItem(USER_PROBLEM_STORAGE_KEY);
}