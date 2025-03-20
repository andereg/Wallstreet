export interface Question {
    title: string;
    answers?: string[];
    additionalAnswer?: boolean;
    includeSlider?: boolean;
}

export interface QuestionResponse {
    question: string;
    answer: string;
}