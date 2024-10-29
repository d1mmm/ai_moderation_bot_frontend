import React, { useState } from 'react';

const categories = [
    { value: "HARM_CATEGORY_HARASSMENT", hint: "Negative or harmful comments targeting identity and/or protected attributes." },
    { value: "HARM_CATEGORY_HATE_SPEECH", hint: "Content that is rude, disrespectful, or profane." },
    { value: "HARM_CATEGORY_SEXUALLY_EXPLICIT", hint: "Contains references to sexual acts or other lewd content." },
    { value: "HARM_CATEGORY_DANGEROUS_CONTENT", hint: "Promotes, facilitates, or encourages harmful acts." }
];

const methods = [
    { value: "HARM_BLOCK_METHOD_UNSPECIFIED", hint: "The harm block method is unspecified." },
    { value: "SEVERITY", hint: "The harm block method uses both probability and severity scores." },
    { value: "PROBABILITY", hint: "The harm block method uses the probability score." }
];

const thresholds = [
    { value: "HARM_BLOCK_THRESHOLD_UNSPECIFIED", hint: "Unspecified harm block threshold." },
    { value: "BLOCK_LOW_AND_ABOVE", hint: "Block low threshold and above (i.e. block more)." },
    { value: "BLOCK_MEDIUM_AND_ABOVE", hint: "Block medium threshold and above." },
    { value: "BLOCK_ONLY_HIGH", hint: "Block only high threshold (i.e. block less)." },
    { value: "BLOCK_NONE", hint: "Block none." },
    { value: "OFF", hint: "Turn off the safety filter." }
];

const AdminPage = () => {
    const [settings, setSettings] = useState({});
    const [hints, setHints] = useState({});

    const handleMethodChange = (category, method) => {
        setSettings((prev) => ({
            ...prev,
            [category]: { ...prev[category], method }
        }));

        const selectedMethod = methods.find(m => m.value === method);
        setHints((prev) => ({
            ...prev,
            [category]: { 
                ...prev[category], 
                methodHint: selectedMethod ? selectedMethod.hint : ""
            }
        }));
    };

    const handleThresholdChange = (category, threshold) => {
        setSettings((prev) => ({
            ...prev,
            [category]: { ...prev[category], threshold }
        }));

        const selectedThreshold = thresholds.find(t => t.value === threshold);
        setHints((prev) => ({
            ...prev,
            [category]: { 
                ...prev[category], 
                thresholdHint: selectedThreshold ? selectedThreshold.hint : ""
            }
        }));
    };

    const handleSaveSettings = () => {
        const updatedSettings = Object.keys(settings).map(category => ({
            category,
            method: settings[category].method || null,
            threshold: settings[category].threshold || null
        }));
    
        fetch("http://127.0.0.1:8000/update-safety-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSettings),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Settings updated successfully") {
                alert("Settings saved!");
            } else {
                alert("Failed to save settings.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while saving settings.");
        });
    };

    return (
        <div className="admin-page">
            <h1>Admin Settings</h1>

            {categories.map((category) => (
                <div key={category.value} className="category-section">
                    <h2>{category.value}</h2>
                    <p className="category-hint">{category.hint}</p>

                    <div className="form-group">
                        <label>Method:</label>
                        <select
                            onChange={(e) => handleMethodChange(category.value, e.target.value)}
                            value={settings[category.value]?.method || ""}
                        >
                            <option value="">Select a method</option>
                            {methods.map((meth) => (
                                <option key={meth.value} value={meth.value}>
                                    {meth.value}
                                </option>
                            ))}
                        </select>
                        {hints[category.value]?.methodHint && (
                            <p className="hint">{hints[category.value].methodHint}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Threshold:</label>
                        <select
                            onChange={(e) => handleThresholdChange(category.value, e.target.value)}
                            value={settings[category.value]?.threshold || ""}
                        >
                            <option value="">Select a threshold</option>
                            {thresholds.map((thresh) => (
                                <option key={thresh.value} value={thresh.value}>
                                    {thresh.value}
                                </option>
                            ))}
                        </select>
                        {hints[category.value]?.thresholdHint && (
                            <p className="hint">{hints[category.value].thresholdHint}</p>
                        )}
                    </div>
                </div>
            ))}

            <button onClick={handleSaveSettings}>Save</button>
        </div>
    );
};

export default AdminPage;
