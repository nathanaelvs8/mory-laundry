import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaGripVertical, FaRobot } from 'react-icons/fa';
import api from '../services/api';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Halo! 👋 Saya asisten AI Mory Laundry.\n\nSaya bisa bantu cek statistik, cari pesanan, atau analisis pelanggan.\n\nAda yang bisa saya bantu?',
            isTyping: false
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [isTypingEffect, setIsTypingEffect] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const messagesEndRef = useRef(null);
    const chatBoxRef = useRef(null);
    
    // Dragging state
    const [position, setPosition] = useState({ x: null, y: null });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Theme colors - Gold/Elegant
    const theme = {
        primary: '#D4A745',
        primaryDark: '#B8932E',
        primaryLight: '#E8C564',
        gradient: 'linear-gradient(135deg, #D4A745 0%, #B8932E 100%)',
        text: '#2D2D2D',
        textLight: '#666666',
        background: '#FFFEF9',
        white: '#FFFFFF'
    };

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Parse markdown bold **text** to <strong>
    const parseMarkdown = (text) => {
        if (!text) return '';
        let parsed = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        parsed = parsed.replace(/\*(.+?)\*/g, '<em>$1</em>');
        parsed = parsed.replace(/\n/g, '<br>');
        return parsed;
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingText]);

    // Typing effect
    const typeMessage = (fullText, callback) => {
        setIsTypingEffect(true);
        setTypingText('');
        let index = 0;
        const speed = 15;

        const type = () => {
            if (index < fullText.length) {
                const chunkSize = 3;
                const chunk = fullText.slice(index, index + chunkSize);
                setTypingText(prev => prev + chunk);
                index += chunkSize;
                setTimeout(type, speed);
            } else {
                setIsTypingEffect(false);
                setTypingText('');
                callback(fullText);
            }
        };
        type();
    };

    // Handle drag start - only on desktop
    const handleDragStart = (e) => {
        if (isMobile) return; // Disable drag on mobile
        if (chatBoxRef.current) {
            const rect = chatBoxRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
        }
    };

    // Handle drag move
    useEffect(() => {
        if (isMobile) return; // Disable drag on mobile
        
        const handleMouseMove = (e) => {
            if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;
                const maxX = window.innerWidth - 380;
                const maxY = window.innerHeight - 520;
                setPosition({
                    x: Math.min(Math.max(0, newX), maxX),
                    y: Math.min(Math.max(0, newY), maxY)
                });
            }
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, isMobile]);

    const handleSend = async () => {
        if (!input.trim() || loading || isTypingEffect) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await api.post('/chat', { message: userMessage });
            
            if (response.data.success) {
                const aiMessage = response.data.data.message;
                setLoading(false);
                
                typeMessage(aiMessage, (fullText) => {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: fullText
                    }]);
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setLoading(false);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: error.response?.data?.message || 'Maaf, terjadi kesalahan. Coba lagi ya.'
            }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        'Pendapatan hari ini?',
        'Pesanan belum selesai?',
        'Top pelanggan?',
        'Web ini buat apa?'
    ];

    const handleQuickQuestion = (question) => {
        setInput(question);
    };

    // Styles - responsive
    const styles = {
        floatingButton: {
            position: 'fixed',
            bottom: isMobile ? 20 : 30,
            right: isMobile ? 20 : 30,
            width: isMobile ? 55 : 65,
            height: isMobile ? 55 : 65,
            borderRadius: '50%',
            background: theme.gradient,
            border: `3px solid ${theme.white}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(212, 167, 69, 0.4)',
            transition: 'all 0.3s ease',
            zIndex: 1000,
            padding: 0,
            overflow: 'hidden'
        },
        chatBox: {
            position: 'fixed',
            background: theme.white,
            borderRadius: isMobile ? '20px 20px 0 0' : 20,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1001,
            // Mobile: full width at bottom
            ...(isMobile ? {
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '70vh',
                maxHeight: '70vh'
            } : {
                width: 370,
                height: 520,
                ...(position.x !== null ? {
                    left: position.x,
                    top: position.y
                } : {
                    bottom: 110,
                    right: 30
                })
            })
        },
        header: {
            background: theme.gradient,
            padding: isMobile ? '12px 15px' : '15px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: isMobile ? 'default' : (isDragging ? 'grabbing' : 'grab'),
            userSelect: 'none'
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: theme.white
        },
        headerIconWrapper: {
            width: isMobile ? 35 : 40,
            height: isMobile ? 35 : 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.white
        },
        headerTitle: {
            margin: 0,
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: theme.white
        },
        headerSubtitle: {
            margin: 0,
            fontSize: isMobile ? 10 : 11,
            opacity: 0.9,
            color: theme.white
        },
        dragIcon: {
            opacity: 0.7,
            marginRight: 4,
            display: isMobile ? 'none' : 'block'
        },
        closeBtn: {
            background: 'rgba(255,255,255,0.25)',
            border: 'none',
            color: theme.white,
            width: isMobile ? 30 : 32,
            height: isMobile ? 30 : 32,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
        },
        messagesContainer: {
            flex: 1,
            overflowY: 'auto',
            padding: isMobile ? 12 : 15,
            background: theme.background
        },
        message: (isUser) => ({
            maxWidth: '85%',
            padding: isMobile ? '10px 14px' : '12px 16px',
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            marginBottom: 12,
            marginLeft: isUser ? 'auto' : 0,
            marginRight: isUser ? 0 : 'auto',
            background: isUser ? theme.gradient : theme.white,
            color: isUser ? theme.white : theme.text,
            boxShadow: isUser 
                ? '0 2px 10px rgba(212, 167, 69, 0.3)' 
                : '0 2px 10px rgba(0,0,0,0.06)',
            wordBreak: 'break-word',
            fontSize: isMobile ? 13 : 14,
            lineHeight: 1.6
        }),
        quickQuestions: {
            padding: isMobile ? '8px 12px' : '10px 15px',
            background: theme.white,
            borderTop: `1px solid #f0f0f0`,
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap'
        },
        quickBtn: {
            padding: isMobile ? '5px 10px' : '6px 12px',
            fontSize: isMobile ? 10 : 11,
            background: theme.background,
            border: `1px solid ${theme.primaryLight}`,
            borderRadius: 20,
            cursor: 'pointer',
            color: theme.primaryDark,
            transition: 'all 0.2s',
            fontWeight: 500
        },
        inputContainer: {
            padding: isMobile ? '12px 12px 20px' : 15,
            background: theme.white,
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: 10,
            alignItems: 'center'
        },
        input: {
            flex: 1,
            padding: isMobile ? '10px 14px' : '12px 18px',
            border: `2px solid #eee`,
            borderRadius: 25,
            outline: 'none',
            fontSize: isMobile ? 14 : 14,
            transition: 'border-color 0.2s',
            background: theme.background
        },
        sendBtn: {
            width: isMobile ? 42 : 46,
            height: isMobile ? 42 : 46,
            borderRadius: '50%',
            background: theme.gradient,
            border: 'none',
            color: theme.white,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 2px 10px rgba(212, 167, 69, 0.3)',
            flexShrink: 0
        },
        typingIndicator: {
            display: 'flex',
            gap: 5,
            padding: '12px 16px',
            background: theme.white,
            borderRadius: 18,
            width: 'fit-content',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: theme.primary,
            animation: 'bounce 1.4s infinite ease-in-out'
        },
        typingMessage: {
            maxWidth: '85%',
            padding: '12px 16px',
            borderRadius: '18px 18px 18px 4px',
            marginBottom: 12,
            background: theme.white,
            color: theme.text,
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            wordBreak: 'break-word',
            fontSize: isMobile ? 13 : 14,
            lineHeight: 1.6
        },
        overlay: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: isMobile && isOpen ? 'block' : 'none'
        }
    };

    return (
        <>
            {/* CSS Animation */}
            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                .chat-dot-1 { animation-delay: -0.32s; }
                .chat-dot-2 { animation-delay: -0.16s; }
                .quick-btn:hover { 
                    background: ${theme.primaryLight} !important; 
                    color: white !important;
                    border-color: ${theme.primaryLight} !important;
                }
                .send-btn:hover { 
                    transform: scale(1.05); 
                    box-shadow: 0 4px 15px rgba(212, 167, 69, 0.4);
                }
                .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
                .chat-input:focus { border-color: ${theme.primary} !important; }
                .floating-btn:hover { 
                    transform: scale(1.1); 
                    box-shadow: 0 6px 25px rgba(212, 167, 69, 0.5);
                }
                .close-btn:hover {
                    background: rgba(255,255,255,0.4) !important;
                }
                .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }
                .chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }
                .chat-messages::-webkit-scrollbar-thumb {
                    background: ${theme.primaryLight};
                    border-radius: 3px;
                }
                .msg-content strong {
                    font-weight: 700;
                    color: ${theme.primaryDark};
                }
                .msg-content em {
                    font-style: italic;
                }
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                .typing-cursor {
                    display: inline-block;
                    width: 2px;
                    height: 16px;
                    background: ${theme.primary};
                    margin-left: 2px;
                    animation: blink 0.8s infinite;
                    vertical-align: middle;
                }
            `}</style>

            {/* Overlay for mobile */}
            <div style={styles.overlay} onClick={() => setIsOpen(false)} />

            {/* Floating Button */}
            {!isOpen && (
                <button 
                    className="floating-btn"
                    style={styles.floatingButton}
                    onClick={() => setIsOpen(true)}
                    title="Chat dengan AI Assistant"
                >
                    <FaRobot size={isMobile ? 24 : 28} color="#fff" />
                </button>
            )}

            {/* Chat Box */}
            {isOpen && (
                <div ref={chatBoxRef} style={styles.chatBox}>
                    {/* Header */}
                    <div style={styles.header} onMouseDown={handleDragStart}>
                        <div style={styles.headerLeft}>
                            <FaGripVertical size={12} style={styles.dragIcon} />
                            <div style={styles.headerIconWrapper}>
                                <FaRobot size={isMobile ? 18 : 22} />
                            </div>
                            <div>
                                <h4 style={styles.headerTitle}>AI Assistant</h4>
                                <p style={styles.headerSubtitle}>Mory Laundry Helper</p>
                            </div>
                        </div>
                        <button className="close-btn" style={styles.closeBtn} onClick={() => setIsOpen(false)}>
                            <FaTimes size={14} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages" style={styles.messagesContainer}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={styles.message(msg.role === 'user')}>
                                <span 
                                    className="msg-content"
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
                                />
                            </div>
                        ))}
                        
                        {/* Loading indicator */}
                        {loading && (
                            <div style={styles.typingIndicator}>
                                <div className="chat-dot-1" style={styles.dot}></div>
                                <div className="chat-dot-2" style={styles.dot}></div>
                                <div style={styles.dot}></div>
                            </div>
                        )}
                        
                        {/* Typing effect message */}
                        {isTypingEffect && typingText && (
                            <div style={styles.typingMessage}>
                                <span 
                                    className="msg-content"
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(typingText) }}
                                />
                                <span className="typing-cursor"></span>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 2 && !loading && !isTypingEffect && (
                        <div style={styles.quickQuestions}>
                            {quickQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    className="quick-btn"
                                    style={styles.quickBtn}
                                    onClick={() => handleQuickQuestion(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={styles.inputContainer}>
                        <input
                            className="chat-input"
                            style={styles.input}
                            type="text"
                            placeholder="Ketik pertanyaan..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading || isTypingEffect}
                        />
                        <button
                            className="send-btn"
                            style={styles.sendBtn}
                            onClick={handleSend}
                            disabled={loading || isTypingEffect || !input.trim()}
                        >
                            <FaPaperPlane size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatWidget;