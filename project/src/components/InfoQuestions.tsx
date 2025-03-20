import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";

export function InfoButton() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="relative">
            {/* Button mit Info-Icon */}
            <button
                onClick={() => setShowInfo(!showInfo)}
                className="button-reveal-border flex space-x-2 px-4 py-2 shadow-md focus:outline-none focus:ring-2"
            >
                <FiInfo size={20} />
                <span>Info</span>
            </button>

            {/* Infotext als Tooltip oder Modal */}
            {showInfo && (
                <div className="absolute z-10 mt-2 w-72 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-700">
                        Bitte beantworten Sie die Fragen sorgfältig. Basierend auf Ihren Antworten werden präzisere und relevantere Fragen gestellt, um Ihr Innovationsprofil zu schärfen. Dadurch kann Ihr spezifisches Problem klar definiert und massgeschneiderte Lösungsvorschläge erarbeitet werden. Dieses Programm ist Teil der Innovationsförderung des Kantons St. Gallen.
                    </p>
                    <button
                        onClick={() => setShowInfo(false)}
                        className="mt-3 px-4 py-2 text-white shadow-md  focus:outline-none focus:ring-2"
                    >
                        Verstanden
                    </button>
                </div>
            )}
        </div>
    );
}