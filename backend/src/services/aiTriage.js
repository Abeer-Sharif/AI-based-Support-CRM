require("dotenv").config();


const ALLOWED_VALUES = {
    category: ["Billing", "Technical", "Account", "Shipping", "Product", "Other"],
    priority: ["Low", "Medium", "High"],
    sentiment: ["Positive", "Neutral", "Negative"]
};
const OLLAMA_BASE_URL = (
    process.env.OLLAMA_BASE_URL ||
    "http://localhost:11434"
).replace(/\/$/, "");
const buildPrompt = (subject, description) => `You are a customer support ticket classification system.

Analyze the following support ticket. Classify it into exactly one category, one priority, and one sentiment.

Category MUST be exactly one of: Billing, Technical, Account, Shipping, Product, Other
Priority MUST be exactly one of: Low, Medium, High
Sentiment MUST be exactly one of: Positive, Neutral, Negative

Priority guidance: use High for urgent customer-impacting issues such as incorrect or duplicate charges, refund requests, account access failures, service-blocking technical faults, or overdue deliveries. Use Medium for issues that affect normal use but are not urgent. Use Low for informational requests or minor issues.

Return ONLY valid JSON. Do not include markdown, explanations, or additional fields.

Required format:
{
  "category": "...",
  "priority": "...",
  "sentiment": "..."
}

Ticket title:
${subject}

Ticket description:
${description}`;

const validateTriage = (triage) => {
    const keys = Object.keys(triage || {}).sort();
    const expectedKeys = ["category", "priority", "sentiment"];

    if (keys.length !== expectedKeys.length || !expectedKeys.every((key) => keys.includes(key))) {
        throw new Error("AI response has an unexpected structure");
    }

    for (const [field, values] of Object.entries(ALLOWED_VALUES)) {
        if (!values.includes(triage[field])) {
            throw new Error(`AI response has an invalid ${field}`);
        }
    }

    return triage;
};

module.exports.triageTicket = async (subject, description) => {
    const controller = new AbortController()
    const timeout = setTimeout(
        () => controller.abort(), 30000
    );
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,

            body: JSON.stringify({
                model: "llama3.2:3b",
                prompt: buildPrompt(subject, description),
                stream: false,
                format: "json"
            })
        });
        if (!response.ok) {
            throw new Error(
                `Ollama request failed with status ${response.status}`
            )
        };
        const payload = await response.json()

        if (!payload.response || typeof payload.response !== "string") {
             throw new Error(
                "Ollama response is missing generated text"
            );
        }

        const triage = JSON.parse(
            payload.response.trim()
        );
        return validateTriage(triage);
    } finally {
        clearTimeout(timeout);
    }
}

module.exports.FALLBACK_TRIAGE = {
    category: "Other",
    priority: "Medium",
    sentiment: "Neutral"
};
