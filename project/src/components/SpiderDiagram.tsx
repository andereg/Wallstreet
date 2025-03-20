import React, { useState } from 'react';

const SpiderDiagram = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [skillLevels, setSkillLevels] = useState<SkillLevels>({
    Bereitschaft: 80,
    Ressourcen: 85,
    Knowhow: 90,
    Positionierung: 75,
    Netzwerk: 88,
    Mindset: 92,
    Strategie: 86,
    Agilität: 78
  });

  // Skills data from the input
  const skills = [
    "Bereitschaft",
    "Ressourcen",
    "Knowhow",
    "Positionierung",
    "Netzwerk",
    "Mindset",
    "Strategie",
    "Agilität"
  ];

  // Calculate positions for the skill labels and data points
  interface Coordinates {
    x: number;
    y: number;
    labelX: number;
    labelY: number;
    angle: number;
  }

  const getCoordinates = (index: number, value: number): Coordinates => {
    const angleSlice = (Math.PI * 2) / skills.length;
    const angle = angleSlice * index - Math.PI / 2; // Start from top (subtract 90 degrees)
    const radius = (value / 100) * 130; // Max radius based on SVG viewBox
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle),
      labelX: 200 + 165 * Math.cos(angle),
      labelY: 200 + 165 * Math.sin(angle),
      angle: angle * (180 / Math.PI) // Convert to degrees for text rotation
    };
  };

  // Handle click to update skill level
  interface SkillLevels {
    [key: string]: number;
  }

  const handlePolygonClick = (index: number): void => {
    const skill = skills[index];
    const currentValue = skillLevels[skill];
    
    // Cycle through values: 60 -> 75 -> 90 -> 60
    let newValue: number;
    if (currentValue < 70) newValue = 75;
    else if (currentValue < 85) newValue = 90;
    else newValue = 60;
    
    setSkillLevels({ ...skillLevels, [skill]: newValue });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 p-4 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Kompetenzprofil</h2>
      
      <div className="relative w-full max-w-lg">
        <svg viewBox="0 0 400 400" className="w-full">
          {/* Background circles */}
          {[1, 2, 3, 4, 5].map((level) => (
            <circle
              key={level}
              cx="200"
              cy="200"
              r={level * 26}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity={0.7}
            />
          ))}
          
          {/* Axis lines for each skill */}
          {skills.map((_, index) => {
            const coords = getCoordinates(index, 100);
            return (
              <line
                key={`axis-${index}`}
                x1="200"
                y1="200"
                x2={coords.x}
                y2={coords.y}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
          
          {/* Skill levels polygon */}
          <polygon
            points={skills.map((skill, index) => {
              const coords = getCoordinates(index, skillLevels[skill]);
              return `${coords.x},${coords.y}`;
            }).join(' ')}
            fill="rgba(59, 130, 246, 0.6)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Skill data points */}
          {skills.map((skill, index) => {
            const coords = getCoordinates(index, skillLevels[skill]);
            return (
              <g key={`data-point-${index}`}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={hoveredSkill === skill ? 6 : 4}
                  fill={hoveredSkill === skill ? "#2563eb" : "#3b82f6"}
                  stroke="white"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => handlePolygonClick(index)}
                />
                {hoveredSkill === skill && (
                  <text
                    x={coords.x}
                    y={coords.y - 12}
                    textAnchor="middle"
                    fill="#2563eb"
                    fontWeight="bold"
                    fontSize="12"
                  >
                    {skillLevels[skill]}%
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Skill labels */}
          {skills.map((skill, index) => {
            const coords = getCoordinates(index, 100);
            let anchor = "middle";
            if (coords.angle > -45 && coords.angle < 45) anchor = "start";
            else if (coords.angle > 135 || coords.angle < -135) anchor = "end";
            
            return (
              <g key={`label-${index}`}>
                <text
                  x={coords.labelX}
                  y={coords.labelY}
                  textAnchor={anchor}
                  dominantBaseline="central"
                  fill={hoveredSkill === skill ? "#2563eb" : "#4b5563"}
                  fontWeight={hoveredSkill === skill ? "bold" : "normal"}
                  fontSize="14"
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => handlePolygonClick(index)}
                >
                  {skill}
                </text>
              </g>
            );
          })}
          
          {/* Central text */}
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#1e40af"
            fontWeight="bold"
            fontSize="16"
          >
            Kompetenzen
          </text>
        </svg>
      </div>
      
      <p className="text-sm text-gray-600 mt-4">Klicken Sie auf einen Datenpunkt, um den Wert zu ändern</p>
    </div>
  );
};

export default SpiderDiagram;