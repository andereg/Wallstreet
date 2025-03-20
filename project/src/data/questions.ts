import {Question} from "../model/question.ts";

export const mainQuestions: Question[] = [
  {
    title: "Welche Position haben Sie in Ihrem Unternehmen?",
    answers: [
      "Geschäftsführung/CEO",
      "Marketing/Vertrieb",
      "Finanzen/Controlling",
      "Produktion/Betrieb",
      "IT/Digitalisierung",
      "Personalwesen",
      "Forschung & Entwicklung",
    ],
    additionalAnswer: true
  },
  {
    title: "Wie würden Sie Ihre aktuelle Beziehung zu Innovation beschreiben?",
    answers: [
      "Ich weiss nicht wirklich, was Innovation für mein Unternehmen bedeutet oder wo ich anfangen soll.",
      "Ich bin bereit und motiviert zu innovieren, brauche aber klare Anleitung und Ressourcen.",
      "Ich verstehe, dass Innovation wichtig ist, habe aber Bedenken bezüglich Risiken und Unsicherheiten."
    ],
  },
  {
    title: "In welcher Branche ist Ihr Unternehmen hauptsächlich tätig?",
    answers: [
      "Produktion/Fertigung",
      "Handwerk",
      "Dienstleistung",
      "Einzelhandel",
      "Gastgewerbe",
      "IT/Technologie",
      "Gesundheitswesen",
    ],
    additionalAnswer: true
  },
  {
    title: "Welches Budget könnten Sie realistischerweise für Innovationsprojekte bereitstellen?",
    includeSlider: true
  },
  {
    title: "Was denken Sie über Innovation für Ihr Unternehmen?",
    answers: [
      "Wir brauchen das nicht, uns geht es gut wie es ist.",
      "Klingt interessant, aber nicht für unsere Branche.",
      "Könnte hilfreich sein, weiss aber nicht wie.",
      "Wir sollten innovieren, aber mir fehlt der Ansatz."
    ]
  },
  {
    title: "Wie informieren Sie sich über Trends in Ihrer Branche?",
    answers: [
      "Hauptsächlich durch Lieferanten und Partner.",
      "Gelegentlich Fachmessen und Zeitschriften.",
      "Ich verlasse mich auf meine Erfahrung.",
      "Das machen wir kaum."
    ]
  },
  {
    title: "Warum haben Sie bisher nicht in neue Technologien investiert?",
    answers: [
      "Sehe keinen Mehrwert für uns.",
      "Zu teuer oder riskant.",
      "Fehlendes Know-how im Team.",
      "Weiss nicht, wo ich anfangen soll."
    ]
  },
  {
    title: "Wie gehen Sie mit Kundenwünschen nach Neuerungen um?",
    answers: [
      "Wir reagieren nur, wenn nötig.",
      "Wir prüfen, ob wir es mit bestehenden Mitteln umsetzen können.",
      "Wir fragen unsere Lieferanten um Rat.",
      "Wir lehnen oft ab, weil es zu komplex ist."
    ]
  },
  {
    title: "Was würde Ihnen am meisten helfen?",
    answers: [
      "Konkrete Beispiele aus meiner Branche.",
      "Einfache Schritte zum Einstieg.",
      "Kontakt zu Experten oder Netzwerken.",
      "Kostengünstige Innovationsmöglichkeiten."
    ]
  }
]

export default mainQuestions;