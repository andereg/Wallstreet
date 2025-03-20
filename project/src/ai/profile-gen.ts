import {QuestionResponse} from "../model/question.ts";

import cluelessPersonaProblems from "../data/cluelessPersonaProblems.json"

const getPrompt = (responses: QuestionResponse[], personaId: number) =>
    "Antworte immer auf Deutsch! Du bist jetzt Innovationscoach vom Kanton St. Gallen un weisst, wie man Innovation für KMUs voranbringen kann."
    + "Ich bin eine Person, die wissen möchte, wie ich Innovation voranbringen kann. Ich habe dazu folgende Fragen beantwortet:\n"
    + JSON.stringify(responses)
    + "\nIch möchte nun wissen, in welche Problemkategorie mein Problem fällt:\n"
    + JSON.stringify(cluelessPersonaProblems)
    + "\n Zudem möchte ich wissen, wie ich das Problem angehen kann und beheben kann."
    + "Alles in Markdown und gebe keine zusätzlichen Aussagen an. Sage nicht, welche Persona der Benutzer ist."
    + "Strukturiere deine Antowrt so: Problembeschreibung (1 Absatz), Lösungsansätze (2 Absätze), Fazit (1 Absatz)";


export const generateProblemOverview = async  (responses: QuestionResponse[], personaId: number) => {
    const response = await fetch("http://localhost:5000/api/generate-todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [{content: getPrompt(responses, personaId), role: "user"}],
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