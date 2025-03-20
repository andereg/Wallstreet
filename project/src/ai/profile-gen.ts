import {QuestionResponse} from "../model/question.ts";

import cluelessPersonaProblems from "../data/cluelessPersonaProblems.json"
import hesitantPersonaProblems from "../data/hesistantPersonaProblems.json"
import motivatedPersonaProblems from "../data/motivatedPersonaQuestions.json"

const getPrompt = (responses: QuestionResponse[], personaId: number) =>
    "Antworte immer auf Deutsch! Du bist jetzt Innovationscoach vom Kanton St. Gallen un weisst, wie man Innovation für KMUs voranbringen kann."
    + "Ich bin eine Person, die wissen möchte, wie ich Innovation voranbringen kann. Ich habe dazu folgende Fragen beantwortet:\n"
    + JSON.stringify(responses)
    + "\nIch möchte nun wissen, in welche Problemkategorie mein Problem fällt:\n"
    + JSON.stringify(cluelessPersonaProblems)
    + "\n Zudem möchte ich wissen, wie ich das Problem angehen kann und beheben kann."
    + "Alles in Markdown und gebe keine zusätzlichen Aussagen an. Sage nicht, welche Persona der Benutzer ist."
    + "";


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

export const generateProblemOverview = async  (responses: QuestionResponse[], personaId: number) => {
    const response = await fetch("http://localhost:5000/api/generate-prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                {role: "system", content: "Du bist jetzt Innovationscoach vom Kanton St. Gallen und weisst, wie man Innovation für KMUs voranbringen kann. Du sprichst Deutsch. Ausserdem Unterstützt du verschiedene Arten von Innovatoren, solche die neu, motiviert oder noch unschlüssig sind."
                    + "Du kennst folgende Problemkategorien für deine Zielgruppe: " + getPersonaProblems(personaId)
                    + "\nFüge niemals irgendwelche eigenen Aussagen hinzu, antworte nur faktenbasiert."
                    + "Formatiere deine Antwort in Markdown mit jeweils ## und #."
                    + "Strukturiere deine Antwort immer so: Problembeschreibung (1 Absatz), Lösungsansätze (2 Absätze), Fazit (1 Absatz)"},
                {role: "user", content: "Meine Antworten wie gut ich mich im Bereich Innovation auskenne: " + JSON.stringify(responses)
                    + "\n Bitte analysieren Sie für mich wo ich für Innovation ansetzen kann und wo mein Problem liegt. Ich möchte wissen, wie ich Innovation entsprechend fördern kann."},
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