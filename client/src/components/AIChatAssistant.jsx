import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import axios from "axios";
import url from "../constants/url";

const AIChatAssistant = ({ destination }) => {
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const cleanMarkdown = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, "").replace(/\*/g, "");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const query = `You are a helpful travel assistant for a trip to ${destination}. 
        Provide practical, concise advice.
        
        User question: ${input}
        
        Format your response with markdown for better readability.`;

      const response = await axios.post(
        `${url}/ai/suggestions`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat failed:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Clear all messages?")) {
      setMessages([]);
    }
  };

  const quickQuestions = [
    "What's the best time to visit?",
    "Local food recommendations?",
    "Safety tips?",
    "Transportation options?",
    "Must-see attractions?",
  ];

  return (
    <>
      <Button variant="outline" onClick={() => setShowModal(true)}>
        <MessageCircle size={16} className="mr-2" />
        Ask AI
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span>AI Travel Assistant</span>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="text-red-600 hover:text-red-700 p-1"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        }
        size="lg"
      >
        <div className="flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="mx-auto mb-3" size={48} />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ask me anything about {destination}!
                </h3>
                <p className="text-sm mb-4">Quick questions to get started:</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm whitespace-pre-wrap">
                          {cleanMarkdown(msg.content)}
                        </p>
                      ) : (
                        <div className="text-sm [&_strong]:font-semibold [&_strong]:text-gray-900">
                          {cleanMarkdown(msg.content)}
                        </div>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          msg.role === "user"
                            ? "text-primary-100"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                placeholder="Ask anything about your trip..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={!input.trim() || loading}>
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AIChatAssistant;
