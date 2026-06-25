import dotenv from "dotenv";

dotenv.config();

const generateResponse = async (prompt) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
         model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // 🔥 DEBUG (remove later if you want)
    console.log("GROQ RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ SAFE CHECK (prevents your error)
    if (!data?.choices?.length) {
      return {
        success: false,
        error: data?.error?.message || "No response from Groq API",
      };
    }

    return {
      success: true,
      reply: data.choices[0].message.content,
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default generateResponse;