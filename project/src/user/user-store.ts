import {QuestionResponse} from "../model/question.ts";

const USER_STORAGE_KEY = "USER_DATA_QUESTIONS"

export const storeUserResponses = (data: QuestionResponse[]) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
}

export const retrieveUserProfile = (): QuestionResponse[] => {
    const savedData = localStorage.getItem(USER_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
}