import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lightbulb, Zap, Target } from "lucide-react";

export function LandingPage() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Trigger animation after component mounts
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
            {/* Hero Section */}
            <div className="relative container mx-auto px-4 pt-16 pb-24">
                {/* Background Element */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-50 rounded-bl-full opacity-50 -z-10"></div>
                
                <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
                    {/* Text Content */}
                    <div className="flex flex-col max-w-xl text-left">
                        {/* Logo & Tagline */}
                        <div className="flex items-center mb-6">
                            <img src="/logo.png" alt="Logo" className="w-16 h-16 mr-4" />
                            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Innovation Guide</span>
                        </div>
                        
                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                            Willkommen bei <span className="text-green-600">Säntis Catalyst</span>
                        </h1>
                        
                        {/* Description */}
                        <p className="text-lg text-gray-600 mb-8">
                            Dein persönlicher Wegweiser zur Innovation! Entdecke neue Perspektiven, 
                            entwickle massgeschneiderte Lösungen und erschließe verborgene Innovationspotenziale 
                            für dein Unternehmen.
                        </p>
                        
                        {/* Call to Action */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button 
                                onClick={() => navigate("/onboarding")}
                                className="px-8 py-4 text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all flex items-center justify-center font-medium"
                            >
                                Jetzt starten
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => navigate("/demo")} 
                                className="px-8 py-4 text-green-600 bg-white border border-green-200 rounded-lg shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all font-medium"
                            >
                                Demo ansehen
                            </button>
                        </div>
                        
                        {/* Social Proof */}
                        <div className="text-sm text-gray-500">
                            Bereits von <span className="font-semibold">1000+</span> Unternehmen genutzt
                        </div>
                    </div>
                    
                    {/* Hero Image */}
                    <div className="relative w-full max-w-md">
                        <div className="absolute -inset-4 bg-green-200 rounded-full blur-3xl opacity-30"></div>
                        <img 
                            src="/hero-image.png" 
                            alt="Innovation Dashboard" 
                            className="relative z-10 w-full h-auto rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
            
            {/* Features Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
                        Wie wir dir helfen, Innovation zu beschleunigen
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all">
                            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <Lightbulb className="text-green-600 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Ideenfindung</h3>
                            <p className="text-gray-600">
                                Strukturierte Methoden und KI-gestützte Analysen zur Entdeckung neuer Geschäftspotenziale.
                            </p>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all">
                            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <Zap className="text-green-600 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Schnelle Umsetzung</h3>
                            <p className="text-gray-600">
                                Von der Idee zum konkreten Aktionsplan mit klaren Schritten und Zeitrahmen.
                            </p>
                        </div>
                        
                        {/* Feature 3 */}
                        <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all">
                            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <Target className="text-green-600 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Massgeschneidert</h3>
                            <p className="text-gray-600">
                                Individuell auf deine Branche und Unternehmenssituation zugeschnittene Lösungskonzepte.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="bg-green-600 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Bereit, dein Innovationspotenzial zu entfalten?
                    </h2>
                    <p className="text-green-100 max-w-2xl mx-auto mb-8">
                        Beginne jetzt deinen persönlichen Innovationsprozess und entdecke neue Wege für nachhaltiges Wachstum.
                    </p>
                    <button 
                        onClick={() => navigate("/")} 
                        className="px-8 py-4 bg-white text-green-600 rounded-lg shadow-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all font-medium"
                    >
                        Jetzt starten
                    </button>
                </div>
            </div>
        </div>
    );
}