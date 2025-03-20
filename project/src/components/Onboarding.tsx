import React, {useEffect, useState} from 'react';

import {mainQuestions} from '../data/questions.ts';
import {clearUserProfile, retrieveUserProfile, storePersonaId, storeUserResponses} from "../user/user-store.ts";
import {Question} from "../model/question.ts";
import {cluelessQuestions} from "../data/clueless-questions.ts";
import {motivatedQuestions} from "../data/motivated-questions.ts";
import {hesitantQuestions} from "../data/hesitant-questions.ts";
import {useNavigate} from "react-router-dom";
import { Radius } from 'lucide-react';
import { InfoButton } from './InfoQuestions.tsx';

export function Onboarding() {

    const [currentQuestion, setCurrentQuestion] = useState<Question>({title: '', answers: []});
    const [currentQuestionSet, setCurrentQuestionSet] = useState(mainQuestions);
    const [questionIdx, setQuestionIdx] = useState(0);
    const [personaQuestionsActive, setPersonaQuestionsActive] = useState(false);
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    const [inputValue, setInputValue] = useState('');

    const [personaId, setPersonaId] = useState(0);

    useEffect(() => {
        const question = currentQuestionSet[questionIdx];
        setCurrentQuestion(question as any);
    }, [questionIdx]);


    const nextQuestion = (question: Question, answer: string, answerIdx: number) => {
        // save
        if (personaQuestionsActive) {
            setProgress(((questionIdx + mainQuestions.length) / (currentQuestionSet.length + hesitantQuestions.length + 2)) * 100);
        } else {
            setProgress(((questionIdx + 1) / (currentQuestionSet.length + hesitantQuestions.length)) * 100);
        }
        if (questionIdx === 0 && !personaQuestionsActive) {
            clearUserProfile();
        }

        if (questionIdx == 1) {
            setPersonaId(answerIdx);
            storePersonaId(answerIdx);
        }

        const savedData = retrieveUserProfile();
        savedData.push({question: question.title, answer});
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
                    console.log(hesitantQuestions);
                    setCurrentQuestionSet(hesitantQuestions);
                    break;
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
                <div id="progressContainer" style={{backgroundColor: "#cccccc", height: "22px", marginBottom: "16px"}}>
                    <div id="progressBar" style={{width: progress + "%", height: "22px", backgroundColor: "#008334", transition: "1s"}}></div>
                </div>
                
                <div className="space-y-6">
                    <h2 className="font-bold text-gray-800 text-center">{currentQuestion?.title}</h2>
                    {currentQuestion?.answers ? (
                        <div>
                            <div className="grid grid-cols-1 gap-4">
                                {currentQuestion.answers.map((a, idx) => (
                                    <button
                                        key={a}
                                        className="button-light-outline"
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
                    ) : currentQuestion.includeSlider ? <div>
                        <div>
                        <input
                            type="range"
                            min="10000"
                            max="200000"
                            step="10000"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
                            style={{
                                background: `linear-gradient(to right, #008334 0%, #008334 ${(Number.parseInt(inputValue) - 10000) / 190000 * 100}%, #e5e7eb ${(inputValue - 10000) / 190000 * 100}%, #e5e7eb 100%)`,
                                WebkitAppearance: "none",
                                appearance: "none"
                            }}
                            />
                            <style>{`
                            input[type="range"]::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                appearance: none;
                                width: 30px;
                                height: 30px;
                                background: transparent;
                                cursor: pointer;
                                border: none;
                                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%23008334' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z'%3e%3c/path%3e%3cpath d='m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'%3e%3c/path%3e%3cpath d='M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0'%3e%3c/path%3e%3cpath d='M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'%3e%3c/path%3e%3c/svg%3e");
                                background-repeat: no-repeat;
                                background-position: center;
                                transform: rotate(45deg);
                            }
                            
                            input[type="range"]::-moz-range-thumb {
                                width: 30px;
                                height: 30px;
                                background: transparent;
                                cursor: pointer;
                                border: none;
                                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%23008334' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z'%3e%3c/path%3e%3cpath d='m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'%3e%3c/path%3e%3cpath d='M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0'%3e%3c/path%3e%3cpath d='M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'%3e%3c/path%3e%3c/svg%3e");
                                background-repeat: no-repeat;
                                background-position: center;
                                transform: rotate(45deg);
                            }
                            `}</style>

                            <div className="mt-4 text-lg font-medium text-gray-700">
                                <span>Budget: </span>
                                <span className="text-green-500 font-bold">CHF {inputValue.toLocaleString()}.-</span>
                            </div>

                            <button
                                onClick={() => nextQuestion(currentQuestion, inputValue, questionIdx)}
                                className="w-full mt-6 px-6 py-3 text-white -500 rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Weiter
                            </button>
                        </div>
                    </div> : (
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
                                className="w-full p-4 text-lg font-medium text-white -500 rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                onClick={() => nextQuestion(currentQuestion, inputValue, 0)}
                            >
                                Weiter
                            </button>
                        </div>
                    )}
                </div>
                <div className="mt-4">
                <InfoButton />
                </div>
        </div>)
    }

    return (
        <div style={{minHeight:"800"}} className="max-w-md mx-auto p-6 bg-white rounded-xl">
            {renderStep()}
        </div>
    );
}