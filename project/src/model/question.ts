export interface Question {
    title: string;
    answers?: string[];
}

export interface QuestionResponse {
    question: string;
    answer: string;
}