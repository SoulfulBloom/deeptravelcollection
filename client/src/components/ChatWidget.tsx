import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, MinusSquare, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "🌸 Hi, I'm your Travel Bloom Concierge! I'm here to help you discover immersive travel experiences that will transform your journey. How can I assist you today?",
      timestamp: new Date()
    },
    {
      id: '2',
      sender: 'bot',
      text: "Looking for more support? Check out our <a href='/snowbird' class='text-blue-600 hover:underline'>Snowbird Toolkit</a> or chat with me about personalized suggestions. You can also email Kymm directly at <a href='mailto:kymm@deeptravelcollections.com' class='text-blue-600 hover:underline'>kymm@deeptravelcollections.com</a> for travel consultation!",
      timestamp: new Date(Date.now() + 1000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Removed auto-open feature - chat now only opens when user clicks the button
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleChat = () => {
    setIsOpen(prev => !prev);
    setIsMinimized(false);
  };
  
  const handleMinimize = () => {
    setIsMinimized(true);
  };
  
  const handleMaximize = () => {
    setIsMinimized(false);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };
  
  // Simple bot response logic
  const getBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let response = '';
    
    if (input.includes('tokyo') || input.includes('japan')) {
      response = "Tokyo is a transformative destination! 🌸 Our Tokyo bloom experience includes hidden temples, vibrant local districts, and authentic food journeys that go beyond the tourist path. <a href='/destination/23' class='text-blue-600 hover:underline'>Discover our Tokyo guide</a> or email <a href='mailto:kymm@deeptravelcollections.com' class='text-blue-600 hover:underline'>Kymm</a> for personalized suggestions!";
    } else if (input.includes('bali') || input.includes('indonesia')) {
      response = "Bali offers a soul-enriching journey! 🌺 Our Bali bloom collection guides you through spiritual retreats, cultural ceremonies, and pristine beaches only locals know about. <a href='/destination/25' class='text-blue-600 hover:underline'>Explore our Bali guide</a> or ask <a href='mailto:kymm@deeptravelcollections.com' class='text-blue-600 hover:underline'>Kymm</a> about hidden gems!";
    } else if (input.includes('barcelona') || input.includes('spain')) {
      response = "Barcelona will awaken your senses! 🌹 Our Barcelona bloom experience reveals architectural wonders, secret tapas havens, and authentic cultural moments beyond the guidebooks. <a href='/destination/24' class='text-blue-600 hover:underline'>Explore Barcelona's secrets</a> with our guide!";
    } else if (input.includes('warm') || input.includes('winter') || input.includes('snowbird')) {
      response = "Seeking winter sunshine? As your Travel Bloom Concierge, I recommend our Canadian Snowbird Alternatives—think Bali's healing energy, Colombia's vibrant culture, or Portugal's peaceful coastal villages. Check out our <a href='/snowbird' class='text-blue-600 hover:underline'>Snowbird Toolkit</a> or email <a href='mailto:kymm@deeptravelcollections.com' class='text-blue-600 hover:underline'>Kymm</a> for personalized recommendations!";
    } else if (input.includes('food') || input.includes('culinary') || input.includes('cuisine')) {
      response = "Culinary journeys are where memories bloom! 🌮 Our food-focused experiences connect you with local chefs, hidden markets, and authentic flavors that tell the story of each destination. Which food culture speaks to your soul? For personalized culinary itineraries, reach out to <a href='mailto:kymm@deeptravelcollections.com' class='text-blue-600 hover:underline'>Kymm</a>.";
    } else if (input.includes('help') || input.includes('suggest') || input.includes('recommend')) {
      response = "I'd be delighted to help your travel dreams bloom! 🌸 Are you seeking cultural immersion, beachside reflection, culinary adventures, or urban exploration? Or perhaps you're a Canadian looking for a winter transformation? For personalized guidance, our <a href='/snowbird' class='text-blue-600 hover:underline'>Snowbird Toolkit</a> is a great resource!";
    } else if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
      response = "Our transformative travel guides range from $8.99 to $49.99, each offering exclusive local insights you won't find elsewhere. For a taste of the Travel Bloom experience, our Immersive Starter Guide is yours free when you join our community! Need help choosing? Email <a href='mailto:kymm@deeptravelcollections.com' class='text-blue-600 hover:underline'>Kymm</a> for personalized recommendations.";
    } else {
      response = "Thank you for connecting! 🌸 As your Travel Bloom Concierge, I'd love to know what kind of journey speaks to you. Are you drawn to cultural discoveries, peaceful retreats, food adventures, or perhaps something completely unique? Browse our <a href='/collections' class='text-blue-600 hover:underline'>Collections</a> for inspiration!";
    }
    
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: response,
      timestamp: new Date()
    };
  };
  
  // Format time for message timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-full shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
      
      {/* Chat Widget */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl z-50 transition-all duration-300 overflow-hidden ${
            isMinimized ? 'w-64 h-12' : 'w-80 md:w-96 h-[500px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Travel Bloom Concierge</h3>
            </div>
            <div className="flex items-center space-x-2">
              {!isMinimized ? (
                <>
                  <button onClick={handleMinimize} className="text-white/80 hover:text-white">
                    <MinusSquare className="h-5 w-5" />
                  </button>
                  <button onClick={toggleChat} className="text-white/80 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button onClick={handleMaximize} className="text-white/80 hover:text-white">
                  <Maximize2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="p-4 h-[400px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-gradient-to-r from-pink-50 to-pink-100 text-gray-800 rounded-tl-none border-l-4 border-pink-300'
                      }`}
                    >
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.text }}></p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 text-gray-800 p-3 rounded-lg rounded-tl-none border-l-4 border-pink-300">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input */}
              <div className="border-t p-3">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Ask me about destinations..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-grow rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  <Link href="/destinations">
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      Browse all destinations
                    </span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}