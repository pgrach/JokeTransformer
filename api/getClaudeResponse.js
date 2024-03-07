export default async function handler(req, res) {
    const { userInput } = req.body;

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.CLAUDE_API_KEY, // Claude API key without 'Bearer'
                "anthropic-version": "2023-06-01" // Have to keep correct version date here.
            },
            body: JSON.stringify({
                model: "claude-3-opus-20240229", // Claude model name
                max_tokens: 1024,
                messages: [
                    { role: "user", content: userInput }]
            })
        });

        if (!response.ok) {
            // Attempt to parse the JSON error response
            const errorResponse = await response.json();
            console.error(`Error response from Claude API:`, errorResponse);

            // Send a detailed error message back to the client
            res.status(response.status).json({
                error: errorResponse.error?.message || 'An unknown error occurred'
            });
            return;
        }

        const data = await response.json();

        // ... handle successful response
        res.status(200).json({ response: data });
    } catch (error) {
        console.error('Error fetching from Claude API:', error);
        res.status(500).json({ error: error.message });
    }
};