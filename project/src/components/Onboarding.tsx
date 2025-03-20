import React, {useEffect, useState} from 'react';

import questions from '../data/questions.ts';
import {retrieveUserProfile, storeUserResponses} from "../user/user-store.ts";
import {Question} from "../model/question.ts";

export function Onboarding() {

    const [currentQuestion, setCurrentQuestion] = useState({title: '', answers: []});
    const [questionIdx, setQuestionIdx] = useState(0);

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const question = questions[questionIdx];
        setCurrentQuestion(question as any);
    }, [questionIdx]);


    const nextQuestion = (question: Question, answer: string) => {
        // save
        const savedData = retrieveUserProfile();
        const updatedData = savedData ? savedData : [];
        updatedData.push({question: question.title, answer});
        storeUserResponses(savedData);
        setQuestionIdx((prevIdx) => prevIdx + 1);
        setInputValue("");
    }


    const renderStep = () => {
        return (<div>
            {
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-800">{currentQuestion?.title}</h1>
                    {currentQuestion?.answers ? (
                        <div className="grid grid-cols-1 gap-4">
                            {currentQuestion.answers.map((a) => (
                                <button
                                    key={a}
                                    className="w-full p-4 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                    onClick={() => nextQuestion(currentQuestion, a)}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="answer" className="text-lg font-medium text-gray-700">
                                    Deine Antwort
                                </label>
                                <input
                                    id="answer"
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    placeholder="Gib deine Antwort ein..."
                                />
                            </div>
                            <button
                                className="w-full p-4 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                onClick={() => nextQuestion(currentQuestion, inputValue)}
                            >
                                Weiter
                            </button>
                        </div>
                    )}
                </div>
            }
        </div>)
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            {renderStep()}
        </div>
    );
}