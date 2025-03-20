import {QuestionResponse} from "../model/question.ts";

import cluelessPersonaProblems from "../data/cluelessPersonaProblems.json"
import hesitantPersonaProblems from "../data/hesistantPersonaProblems.json"
import motivatedPersonaProblems from "../data/motivatedPersonaQuestions.json"
import contacts from "../data/innovationContactPerson.json"
import {retrieveUserTodos} from "../user/user-store.ts";

const getUserBasePrompt = (responses: QuestionResponse[], personaId: number, formatting: string) => {
    return [
        {
            role: "system",
            content: "Du bist jetzt Innovationscoach vom Kanton St. Gallen und weisst, wie man Innovation für KMUs voranbringen kann. Du sprichst Deutsch. Ausserdem Unterstützt du verschiedene Arten von Innovatoren, solche die neu, motiviert oder noch unschlüssig sind."
                + "Du kennst folgende Problemkategorien für deine Zielgruppe: " + getPersonaProblems(personaId)
                + "\nFüge niemals irgendwelche eigenen Aussagen hinzu, antworte nur faktenbasiert."
                + "Sprich direkt den Benutzer an mit Sie und gib respektvolle Antoworten"
                + formatting
        },
        {
            role: "user",
            content: "Meine Antworten wie gut ich mich im Bereich Innovation auskenne: " + JSON.stringify(responses)
                + "\n Bitte analysieren Sie für mich wo ich für Innovation ansetzen kann und wo mein Problem liegt. Ich möchte wissen, wie ich Innovation entsprechend fördern kann."
        },

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

export const generateProblemOverview = async (responses: QuestionResponse[], personaId: number) => {
    const response = await fetch("http://localhost:5000/api/generate-prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                getUserBasePrompt(responses, personaId,
                    "Formatiere deine Antwort in Markdown mit jeweils ## und #."
                    + "Strukturiere deine Antwort immer so: Kategorie (Nenne Kategorie mit K...), Herausforderung (1 Absatz), Lösungsansätze (2 Absätze), Fazit (1 Absatz)"
                )
            ],
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
            messages: [
                {role: "system", content: "Only respond in JSON and DO NOT include any additional explanations. Use the format: [{id: number, title: string, details: string, completed: boolean}]"},
                {role: "assistant", content: actionPlan},
                {role: "user", content: "Generate 5 todos for my provided action plan in the JSON format. The first todo should be contact the appropriate institution from this list:"
                        + JSON.stringify(contacts)
                        + " Do not include any explanation and only speak German."}
            ],
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