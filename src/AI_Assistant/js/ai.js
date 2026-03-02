async function generateAIText() {
    const savedData = localStorage.getItem("bmiData");
    console.log(savedData);

    if (!savedData) {
        alert("Bitte zuerst den BMI berechnen.");
        return;
    }

    let settings = {
        gender: 'none'
    }

    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings){
        settings = JSON.parse(savedSettings);
    }

    const { age, date, weight, height, bmi, category } = JSON.parse(savedData);

    const prompt = `
Erstelle einen kurzen, sachlichen Fließtext auf Deutsch für eine Schul-Web-App.

Datum: ${date}
Geschlecht: ${settings.gender}
Alter: ${age} Jahre
Größe: ${height} cm
Gewicht: ${weight} kg
BMI: ${bmi}
BMI-Kategorie: ${category}

Der Text soll neutral und verständlich sein.
`;

    try {
        const response = await fetch("http://localhost:1234/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "local-model",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3
            })
        });

        const data = await response.json();

        document.getElementById("aiText").innerText =
            data.choices[0].message.content;

    } catch (error) {
        console.error(error);
        alert("Fehler bei der Verbindung mit der KI.");
    }
    
}
