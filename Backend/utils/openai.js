import "dotenv/config";

const getAIResponse = async (messages) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not set");
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", 
      messages: messages
    })
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      options
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Groq API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (err) {
    console.error("Groq API detailed error:", err.message);
    throw err;
  }
};

export default getAIResponse;