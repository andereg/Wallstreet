import {useState} from "react";
import { ChevronDown } from "lucide-react"; // Import Lucide Icons

export const WikiArticle = ({data}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
            className="button-light-outline w-full text-left text-xl font-bold flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
            >
            {data.titel}
            <ChevronDown 
                className={`w-6 h-6 transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
                }`}
            />
            </button>
            {isOpen && (
                <div className="mt-4 space-y-4 pl-2 pr-2">
                    <p className="text-gray-700"><strong>Definition:</strong> {data.definition}</p>

                    <Section title="Ursachen">
                        <SubSection title="Psychologische Faktoren" items={data.ursachen.psychologische_faktoren}/>
                        <SubSection title="Strukturelle Faktoren" items={data.ursachen.strukturelle_faktoren}/>
                    </Section>

                    <Section title="Symptome und Auswirkungen">
                        <List title="Erkennungsmerkmale" items={data.symptome_und_auswirkungen.erkennungsmerkmale}/>
                        <SubSection title="Negative Folgen" items={data.symptome_und_auswirkungen.negative_folgen}/>
                    </Section>

                    <Section title="Lösungsansätze">
                        <SubSection title="Methodische Ansätze" items={data.loesungsansaetze.methodische_ansaetze}/>
                        <SubSection title="Kulturelle Veränderungen"
                                    items={data.loesungsansaetze.kulturelle_veraenderungen}/>
                        <SubSection title="Unterstützende Tools" items={data.loesungsansaetze.unterstuetzende_tools}/>
                    </Section>

                    <Section title="Best Practices">
                        <SubSection title="Erfolgreiche Beispiele" items={data.best_practices.erfolgreiche_beispiele}/>
                        <List title="Praktische Tipps" items={data.best_practices.praktische_tipps}/>
                    </Section>

                    <Section title="Quellen">
                        <ul className="list-disc pl-5">
                            {data.quellen.map((quelle, index) => (
                                <li key={index} className="text-gray-700">{quelle.autor}: <em>{quelle.titel}</em></li>
                            ))}
                        </ul>
                    </Section>
                </div>
            )}
        </div>
    );
};

const Section = ({title, children}) => (
    <div>
        <h2 className="text-lg font-semibold mt-4">{title}</h2>
        {children}
    </div>
);

const SubSection = ({title, items}) => (
    <div>
        <h3 className="text-md font-medium mt-2">{title}</h3>
        <ul className="list-disc pl-5">
            {items.map((item, index) => (
                <li key={index} className="text-gray-700">
                    <strong>{item.name}:</strong> {item.beschreibung}
                </li>
            ))}
        </ul>
    </div>
);

const List = ({title, items}) => (
    <div>
        <h3 className="text-md font-medium mt-2">{title}</h3>
        <ul className="list-disc pl-5">
            {items.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
            ))}
        </ul>
    </div>
);

