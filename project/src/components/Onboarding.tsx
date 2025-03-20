import React, {useEffect, useState} from 'react';

import questions, {mainQuestions} from '../data/questions.ts';
import {retrieveUserProfile, storePersonaId, storeUserResponses} from "../user/user-store.ts";
import {Question} from "../model/question.ts";
import {cluelessQuestions} from "../data/clueless-questions.ts";
import {motivatedQuestions} from "../data/motivated-questions.ts";
import {hesitantQuestions} from "../data/hesitant-questions.ts";
import {useNavigate} from "react-router-dom";

export function Onboarding() {

    const [currentQuestion, setCurrentQuestion] = useState<Question>({title: '', answers: []});
    const [currentQuestionSet, setCurrentQuestionSet] = useState(mainQuestions);
    const [questionIdx, setQuestionIdx] = useState(0);
    const [personaQuestionsActive, setPersonaQuestionsActive] = useState(false);
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');

    const [personaId, setPersonaId] = useState(0);

    useEffect(() => {
        const question = currentQuestionSet[questionIdx];
        setCurrentQuestion(question as any);
    }, [questionIdx]);


    const nextQuestion = (question: Question, answer: string, answerIdx: number) => {
        // save

        if (questionIdx == 1) {
            setPersonaId(answerIdx);
            storePersonaId(answerIdx);
        }

        const savedData = retrieveUserProfile();
        const updatedData = savedData ? savedData : [];
        updatedData.push({question: question.title, answer});
        storeUserResponses(savedData);

        if (questionIdx === currentQuestionSet.length - 1) {

            if (personaQuestionsActive) {
                navigate("/generate");
            }

            switch (personaId) {
                case 0:
                    setCurrentQuestionSet(cluelessQuestions);
                    break;
                case 1:
                    setCurrentQuestionSet(motivatedQuestions);
                    break;
                case 2:
                    setCurrentQuestionSet(hesitantQuestions);
            }
            setPersonaQuestionsActive(true);
            setQuestionIdx(0);
        } else {
            setQuestionIdx((prevIdx) => prevIdx + 1);
        }

        setInputValue("");
    }


    const renderStep = () => {
        return (<div>
            {
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-800">{currentQuestion?.title}</h1>
                    {currentQuestion?.answers ? (
                        <div>
                            <div className="grid grid-cols-1 gap-4">
                                {currentQuestion.answers.map((a, idx) => (
                                    <button
                                        key={a}
                                        className="w-full p-4 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                        onClick={() => nextQuestion(currentQuestion, a, idx)}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                            {currentQuestion.additionalAnswer ?
                                <div>
                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            placeholder="Etwas anderes..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    {inputValue.length != 0 ?
                                        <button
                                            className="w-full mt-2 p-4 text-lg font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                                            onClick={() => nextQuestion(currentQuestion, inputValue, questionIdx)} // -1 für benutzerdefinierte Eingabe
                                        >
                                            Weiter
                                        </button>
                                        : ''}
                                </div>
                                : ''}


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
                                onClick={() => nextQuestion(currentQuestion, inputValue, 0)}
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