import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function Chat() {

    const { documentId } = useParams();

    const navigate = useNavigate();

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    async function sendMessage() {

        if (question.trim() === "") {

            return;

        }

        const userMessage = {

            type: "user",

            text: question

        };

        setMessages(previous => [

            ...previous,

            userMessage

        ]);

        const currentQuestion = question;

        setQuestion("");

        setLoading(true);

        try {

            const response = await api.post(

                `/chat/${documentId}`,

                {

                    question: currentQuestion

                }

            );

            setMessages(previous => [

                ...previous,

                {

                    type: "ai",

                    text: response.data.answer

                }

            ]);

        }

        catch (error) {

            setMessages(previous => [

                ...previous,

                {

                    type: "ai",

                    text:

                        error.response?.data?.detail ||

                        "Unable to generate response."

                }

            ]);

        }

        finally {

            setLoading(false);

        }

    }

    function handleKeyDown(event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    }

    return (

        <div className="chat-page">

            <div className="chat-header">

                <h1>

                    🤖 Cogniva AI Tutor

                </h1>

                <button

                    onClick={() =>

                        navigate(`/documents/${documentId}`)

                    }

                >

                    Back

                </button>

            </div>

            <div className="chat-box">

                {

                    messages.length === 0 && (

                        <div className="empty-chat">

                            <h3>

                                Ask anything about your uploaded document.

                            </h3>

                            <p>

                                Examples:

                            </p>

                            <ul>

                                <li>

                                    Summarize Chapter 2

                                </li>

                                <li>

                                    Explain this topic

                                </li>

                                <li>

                                    What are the key points?

                                </li>

                                <li>

                                    Give important definitions

                                </li>

                            </ul>

                        </div>

                    )

                }

                {

                    messages.map(

                        (message, index) => (

                            <div

                                key={index}

                                className={

                                    message.type === "user"

                                    ?

                                    "user-message"

                                    :

                                    "ai-message"

                                }

                            >

                                <strong>

                                    {

                                        message.type === "user"

                                        ?

                                        "You"

                                        :

                                        "Cogniva AI"

                                    }

                                </strong>

                                <p>

                                    {message.text}

                                </p>

                            </div>

                        )

                    )

                }

                {

                    loading && (

                        <div className="ai-message">

                            <strong>

                                Cogniva AI

                            </strong>

                            <p>

                                Thinking...

                            </p>

                        </div>

                    )

                }

            </div>

            <div className="chat-input">

                <input

                    type="text"

                    placeholder="Ask a question..."

                    value={question}

                    onChange={(event) =>

                        setQuestion(

                            event.target.value

                        )

                    }

                    onKeyDown={handleKeyDown}

                />

                <button

                    onClick={sendMessage}

                    disabled={loading}

                >

                    Send

                </button>

            </div>

        </div>

    );

}

export default Chat;