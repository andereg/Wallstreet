import {QuestionResponse} from "../model/question.ts";

import cluelessPersonaProblems from "../data/cluelessPersonaProblems.json"
import hesitantPersonaProblems from "../data/hesistantPersonaProblems.json"
import motivatedPersonaProblems from "../data/motivatedPersonaQuestions.json"
import contacts from "../data/innovationContactPerson.json"
import {retrieveUserTodos} from "../user/user-store.ts";

export interface UserProblem {
    category: string;
    description: string;
    impact: string;
}

const getUserBasePrompt = (responses: QuestionResponse[], personaId: number) => {
    return [
        {
            role: "system",
            content: "Du bist jetzt Innovationscoach vom Kanton St. Gallen und weisst, wie man Innovation für KMUs voranbringen kann. Du sprichst Deutsch. Ausserdem Unterstützt du verschiedene Arten von Innovatoren, solche die neu, motiviert oder noch unschlüssig sind."
                + "Du kennst folgende Problemkategorien für deine Zielgruppe: " + JSON.stringify(getPersonaProblems(personaId))
                + "\nFüge niemals irgendwelche eigenen Aussagen hinzu, antworte nur faktenbasiert."
                + "Sprich direkt den Benutzer an mit Sie und gib respektvolle Antworten. Schreibe nicht aus Sicht einer Drittperson und formuliere aus!"
                + "Der Benutzer hat folgende Angaben zu seinem Innovationsprofil gegeben: " + JSON.stringify(responses)
        }
    ]
};


const getPersonaProblems = (personaId: number) => {
    switch (personaId) {
        case 0:
            return cluelessPersonaProblems;
        case 1:
            return hesitantPersonaProblems;
        case 2:
            return motivatedPersonaProblems;
    }
}

const getProblemSection = async (responses: QuestionResponse[], personaId: number, problemPrompt: string) => {
    const response = await fetch("http://localhost:5000/api/generate-prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                ...getUserBasePrompt(responses, personaId),
                {
                    role: "user",
                    content: problemPrompt
                }
            ],
            model: "llama3",
        }),
    });

    if (!response.ok) throw new Error(`Server Error: ${response.status}`);

    const data = await response.json();
    return {
        details: data?.choices?.[0]?.message?.content || "Es ist ein Fehler aufgetreten",
        completed: false,
    };
}

export const generateProblemOverview = async (responses: QuestionResponse[], personaId: number) => {
        // Definiere die Promises für die drei Aufrufe
        const categoryPromise = getProblemSection(
            responses,
            personaId,
            "Gib den Titel der Problemkategorie, woran das Innovationsproblem leidet. Nur ein Wort und keine eigenen Aussagen"
        );

        const descriptionPromise = categoryPromise.then((categoryResult) =>
            getProblemSection(
                responses,
                personaId,
                "Gib eine Beschreibung an 2 Sätzen zu meinem Problem, das mich an Innovations der Problemkategorie " +
                categoryResult.details +
                " basierend auf meinem Profil"
            )
        );

        const impactPromise = categoryPromise.then((categoryResult) =>
            getProblemSection(
                responses,
                personaId,
                "Gib den impact zum Problem " + categoryResult.details + " in 2 Sätzen wieder."
            )
        );

        // Warte auf alle Promises gleichzeitig
        const [categoryResult, descriptionResult, impactResult] = await Promise.all([
            categoryPromise,
            descriptionPromise,
            impactPromise,
        ]);

        // Extrahiere die Details
        const category = categoryResult.details;
        const description = descriptionResult.details;
        const impact = impactResult.details;

        return {
            details: {
                category,
                description,
                impact,
            },
            completed: true,
        };


    // const response = await fetch("http://localhost:5000/api/generate-prompt", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         messages: [
    //             ...getUserBasePrompt(responses, personaId,
    //                 "Formatiere deine Antwort immer in JSON und füge nie eigenen Aussagen hinzu!"
    //                 + "Führe genau eine Herausforderung  aus, antworte NUR im Format: {category: string, description: string, impact: string}. Beachte, dass die JSON attribute lowercase sind. " +
    //                 "'description' und 'impact' sollte genau 3 Sätze haben. 'category' sollte beim Namen genannte werden."
    //             )
    //         ],
    //         model: "llama3",
    //     }),
    // });
    //
    // if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    //
    // const data = await response.json();
    // return {
    //     details: data?.choices?.[0]?.message?.content || "Es ist ein Fehler aufgetreten",
    //     completed: false,
    // };
}

export const getTodoPrompts = (actionPlan: string) =>
    [
        {
            role: "system",
            content: "Only respond in JSON and DO NOT include any additional explanations. Use the format: [{id: number, title: string, details: string, completed: boolean}]"
        },
        {role: "assistant", content: actionPlan},
        {
            role: "user",
            content: "Generate 5 todos for my provided action plan in the JSON format. The first todo should be contact the appropriate institution from this list:"
                + JSON.stringify(contacts)
                + " Do not include any explanation and only speak German."
        }
    ];

export const getUserTodos = async (actionPlan: string) => {
    const saved = retrieveUserTodos();
    if (saved) {
        return {
            details: saved
        }
    }

    const response = await fetch("http://localhost:5000/api/generate-prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: getTodoPrompts(actionPlan),
            model: "mixtral",
        }),
    });

    if (!response.ok) throw new Error(`Server Error: ${response.status}`);

    const data = await response.json();
    return {
        details: data?.choices?.[0]?.message?.content || "Es ist ein Fehler aufgetreten",
        completed: false,
    };
}