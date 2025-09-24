import React, { useState, useRef, useEffect } from 'react';

const AiConsultantChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Salom! Men sizning AI maslahatchiingizman. Qanday yordam bera olaman?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('narx') || input.includes('price')) {
      return "Mahsulot narxlari turli omillarga bog'liq: material sifatiga, miqdoriga, yetkazib berish joyiga. Aniq narxni bilish uchun mahsulot detallarini yuboring.";
    } else if (input.includes('yetkazib berish') || input.includes('delivery')) {
      return "Yetkazib berish muddati odatda 1-3 ish kuni. Qo'shimcha ma'lumot uchun yetkazib berish manzilini ko'rsating.";
    } else if (input.includes('to\'lov') || input.includes('payment')) {
      return "Biz quyidagi to'lov usullarini qo'llab-quvvatlaymiz: naqd pul, bank o'tkazmasi, karta orqali. Qaysi usulni tanlagansiz?";
    } else if (input.includes('buyurtma') || input.includes('order')) {
      return "Buyurtma berish uchun mahsulot tanlang, miqdorini ko'rsating va to'lov usulini tanlang. Buyurtma ID ni saqlab qo'ying.";
    } else {
      return "Tushundim! Bu haqda batafsil ma'lumot berishim uchun savolingizni aniqroq tushuntirib bering.";
    }
  };

  const quickQuestions = [
    "Mahsulot narxi qancha?",
    "Yetkazib berish muddati qancha?",
    "Qanday to'lov usullari mavjud?",
    "Buyurtmani qanday bekor qilaman?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <span className="material-symbols-outlined text-purple-600">
              smart_toy
            </span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Maslahatchi</h1>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-900 border'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-4 bg-white border-t">
          <p className="text-sm text-gray-600 mb-3">Tez-tez so'raladigan savollar:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiConsultantChat;
