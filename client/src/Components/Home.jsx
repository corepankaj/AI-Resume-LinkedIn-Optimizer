import { useState } from "react";
import axios from "axios";

const Home = () => {
    const [resume, setResume] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("resume");

    const analyzeResume = async () => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/analyze", {
                resumeText: resume,
            });
            setResult(res.data.data);
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const optimizeLinkedIn = async () => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/linkedin", {
                profile: linkedin,
            });
            setResult({ text: res.data.data }); // text mode
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(
            typeof result === "string" ? result : JSON.stringify(result, null, 2)
        );
        alert("Copied ✅");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Sidebar */}
            <div className="w-60 bg-white shadow-lg p-5">
                <h2 className="text-xl font-bold mb-6">🚀 AI Tool</h2>

                <button
                    onClick={() => setActiveTab("resume")}
                    className={`block w-full p-2 rounded mb-2 ${activeTab === "resume" ? "bg-blue-500 text-white" : ""
                        }`}
                >
                    📄 Resume
                </button>
                

                <button
                    onClick={() => setActiveTab("linkedin")}
                    className={`block w-full p-2 rounded ${activeTab === "linkedin" ? "bg-green-500 text-white" : ""
                        }`}
                >
                    💼 LinkedIn
                </button>
            </div>

            {/* Main */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6">
                    AI Resume + LinkedIn Optimizer
                </h1>

                {/* Resume Tab */}
                {activeTab === "resume" && (
                    <div className="bg-white p-5 rounded-xl shadow mb-6">
                        <textarea
                            rows="6"
                            className="w-full border p-3 rounded"
                            placeholder="Paste resume..."
                            onChange={(e) => setResume(e.target.value)}
                        />
                        <button
                            onClick={analyzeResume}
                            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Analyze Resume
                        </button>
                        
                    </div>
                )}

                {/* LinkedIn Tab */}
                {activeTab === "linkedin" && (
                    <div className="bg-white p-5 rounded-xl shadow mb-6">
                        <textarea
                            rows="5"
                            className="w-full border p-3 rounded"
                            placeholder="Paste LinkedIn profile..."
                            onChange={(e) => setLinkedin(e.target.value)}
                        />
                        <button
                            onClick={optimizeLinkedIn}
                            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Optimize LinkedIn
                        </button>
                    </div>
                )}

                {/* Loader */}
                {loading && (
                    <div className="flex justify-center mt-5">
                        <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
                    </div>
                )}

                {/* Result */}
                {result && !loading && (
                    <div className="bg-white p-5 rounded-xl shadow mt-5">

                        {/* ATS Mode */}
                        {result.atsScore && (
                            <>
                                <div className="bg-blue-50 p-4 rounded mb-4 text-center">
                                    <h3>🎯 ATS Score</h3>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {result.atsScore}/100
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {Object.entries(result.sections).map(([k, v]) => (
                                        <div key={k} className="bg-gray-100 p-2 rounded">
                                            {k}: {v}
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold">Summary</h3>
                                    <p>{result.summary}</p>
                                </div>

                                <div className="mb-4">
                                    <h3>Improvements</h3>
                                    <ul className="list-disc ml-5">
                                        {result.improvements.map((i, idx) => (
                                            <li key={idx}>{i}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <h3>Missing Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.keywordsMissing.map((k, i) => (
                                            <span key={i} className="bg-red-100 px-2 py-1 rounded">
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3>Improved Resume</h3>
                                    <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                                        {result.improvedResume}
                                    </pre>
                                </div>
                            </>
                        )}

                        {/* LinkedIn Mode */}
                        {result.text && (
                            <pre className="whitespace-pre-wrap">
                                {result.text}
                            </pre>
                        )}

                        <button
                            onClick={copyToClipboard}
                            className="mt-3 bg-black text-white px-4 py-2 rounded"
                        >
                            Copy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;