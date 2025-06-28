import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

// --- CONSTANT DATA ---
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};
const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 }, boxShadow: '0 0 20px rgba(0, 221, 235, 0.8)' },
  tap: { scale: 0.95 },
};
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, delay: i * 0.2, ease: 'easeOut' } }),
};
const navVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};
const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
};
const chatPanelVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};
const features = [
  { title: "AI-Driven Data Cleaning", desc: "Clean your datasets effortlessly with AI-powered suggestions, anomaly detection, and smart workflows. Handle missing values, duplicates, and more with precision." },
  { title: "Predictive Analytics", desc: "Unlock the future with time series forecasting, clustering, and one-click ML model training. Generate synthetic data and visualize feature importance with ease." },
  { title: "AI Chat Assistant", desc: "Get instant answers to data-related questions with our AI-powered chat assistant, designed to guide you through analysis and provide actionable insights." },
];
const howItWorksSteps = [
  { step: 1, title: "Upload Your Dataset", desc: "Start by uploading your CSV or Excel file (up to 200MB). Preview the first 10 rows and view metadata like rows, columns, and data health." },
  { step: 2, title: "Clean with AI Precision", desc: "Use AI-driven suggestions to handle missing values, outliers, and duplicates, or apply manual cleaning tools like encoding and geolocation enrichment." },
  { step: 3, title: "Discover Actionable Insights", desc: "Generate natural language insights powered by AI, such as correlations and trends, to understand your data better." },
  { step: 4, title: "Create Dynamic Visualizations", desc: "Build interactive charts like scatter plots, heatmaps, and time series forecasts to explore your data visually." },
  { step: 5, title: "Leverage Predictive Analytics", desc: "Forecast trends, generate synthetic data, or train machine learning models with one-click deployment for powerful predictions." },
];
const testimonials = [
  { title: "Healthcare Insights", desc: "Analyzed thyroid patient data, cleaned missing values with AI suggestions, and visualized correlations to identify key health trends." },
  { title: "Business Forecasting", desc: "Uploaded sales data, used time series forecasting to predict future trends, and created interactive charts for stakeholder presentations." },
  { title: "Data Science Research", desc: "Generated synthetic datasets for classification tasks and trained ML models with one-click deployment to accelerate research." },
  { title: "Marketing Optimization", desc: "Cleaned customer data and used clustering to segment audiences, improving campaign targeting and ROI." },
];
const benefits = [
  { icon: <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: "AI-Driven Efficiency", desc: "Streamline data cleaning with AI suggestions, automating tasks like handling missing values and detecting outliers." },
  { icon: <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, title: "Intuitive Interface", desc: "Enjoy a user-friendly platform with undo/redo, templates, and pagination for seamless data management." },
  { icon: <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: "Versatile Visualizations", desc: "Create dynamic charts, from heatmaps to 3D scatter plots, to explore your data with ease." },
  { icon: <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>, title: "Advanced Analytics", desc: "Unlock predictive power with time series forecasting, clustering, and one-click ML model training." },
];

// DataSphere Component
const DataSphere = memo(() => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rotationRef = useRef({ xAngle: 0, yAngle: 0 });
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
    const debounce = (func, delay) => {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
      };
    };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    let animationFrameId;

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const debouncedSetCanvasSize = debounce(setCanvasSize, 250);
    window.addEventListener('resize', debouncedSetCanvasSize);
    setCanvasSize();

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const nodes = [];
    const numNodes = 80;
    const sphereRadius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.35;
    const colors = ['#FFD700', '#E8ECEF', '#00DDEB', '#FF6F61'];

    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      nodes.push({
        id: i,
        baseX: sphereRadius * Math.cos(theta) * Math.sin(phi),
        baseY: sphereRadius * Math.sin(theta) * Math.sin(phi),
        baseZ: sphereRadius * Math.cos(phi),
        x: 0,
        y: 0,
        z: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2.5 + 2.5,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const particles = Array.from({ length: 400 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      radius: Math.random() * 0.6 + 0.3,
      alpha: Math.random() * 0.3 + 0.2,
      speed: Math.random() * 0.5 + 0.2,
    }));

    let targetXAngle = 0;
    let targetYAngle = 0;
    let autoRotateAngle = 0;

    const draw = (time) => {
      ctx.fillStyle = '#02020A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      const gradient = ctx.createRadialGradient(
        canvas.offsetWidth / 2,
        canvas.offsetHeight / 2,
        0,
        canvas.offsetWidth / 2,
        canvas.offsetHeight / 2,
        Math.max(canvas.offsetWidth, canvas.offsetHeight) / 1.1
      );
      gradient.addColorStop(0, `rgba(2, 2, 10, 0.15)`);
      gradient.addColorStop(0.3, `rgba(0, 20, 40, ${0.35 + Math.sin(time * 0.0005) * 0.05})`);
      gradient.addColorStop(0.6, `rgba(0, 30, 50, ${0.45 + Math.cos(time * 0.0005) * 0.05})`);
      gradient.addColorStop(1, 'rgba(2, 2, 10, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach(particle => {
        particle.y += particle.speed;
        if (particle.y > canvas.offsetHeight) particle.y = -particle.radius;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 236, 239, ${particle.alpha})`;
        ctx.fill();
      });
      ctx.restore();

      autoRotateAngle += 0.005;

      targetXAngle = mousePos.y * Math.PI * 0.5;
      targetYAngle = mousePos.x * Math.PI * 0.5;
      rotationRef.current.xAngle += (targetXAngle - rotationRef.current.xAngle) * 0.1;
      rotationRef.current.yAngle += (targetYAngle - rotationRef.current.yAngle) * 0.1;

      ctx.save();
      ctx.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);

      nodes.sort((a, b) => b.z - a.z);

      nodes.forEach(node => {
        const combinedYAngle = rotationRef.current.yAngle + autoRotateAngle;
        const rotX1 = Math.cos(combinedYAngle) * node.baseX + Math.sin(combinedYAngle) * node.baseZ;
        const rotZ1 = -Math.sin(combinedYAngle) * node.baseX + Math.cos(combinedYAngle) * node.baseZ;
        const rotY2 = Math.cos(rotationRef.current.xAngle) * node.baseY - Math.sin(rotationRef.current.xAngle) * rotZ1;
        const rotZ2 = Math.sin(rotationRef.current.xAngle) * node.baseY + Math.cos(rotationRef.current.xAngle) * rotZ1;

        node.x = rotX1;
        node.y = rotY2;
        node.z = rotZ2;

        const scale = 1200 / (1200 + node.z);
        const x2d = node.x * scale;
        const y2d = node.y * scale;

        const pulse = Math.sin(time * 0.0015 + node.pulseOffset) * 0.6 + 0.4;
        const currentSize = node.size * (0.8 + pulse * 0.4);

        const glowGradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, currentSize * 2.5);
        glowGradient.addColorStop(0, node.color === '#FFD700' ? `rgba(255, 215, 0, ${0.85 + pulse * 0.15})` :
                                  node.color === '#E8ECEF' ? `rgba(232, 236, 239, ${0.75 + pulse * 0.15})` :
                                  node.color === '#00DDEB' ? `rgba(0, 221, 235, ${0.75 + pulse * 0.15})` :
                                  `rgba(255, 111, 97, ${0.75 + pulse * 0.15})`);
        glowGradient.addColorStop(0.6, `rgba(0, 0, 0, 0.2)`);
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(x2d, y2d, currentSize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2d, y2d, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 20 + pulse * 10;
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i];
          const nj = nodes[j];
          const dist = Math.sqrt(
            Math.pow(ni.x - nj.x, 2) +
            Math.pow(ni.y - nj.y, 2) +
            Math.pow(ni.z - nj.z, 2)
          );

          if (dist < sphereRadius * 0.85) {
            const scaleI = 1200 / (1200 + ni.z);
            const scaleJ = 1200 / (1200 + nj.z);
            const x1 = ni.x * scaleI;
            const y1 = ni.y * scaleI;
            const x2 = nj.x * scaleJ;
            const y2 = nj.y * scaleJ;

            const opacity = Math.max(0, 0.85 - dist / (sphereRadius * 1.0)) * (Math.sin(time * 0.001 + i + j) * 0.4 + 0.6);
            const lineWidth = 1 + opacity * 1.5;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(0, 221, 235, ${opacity * 0.9})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
        }
      }
      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', debouncedSetCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <motion.canvas ref={canvasRef} className="data-sphere" style={{ y: yParallax }} />;
});

// TypingEffect Component
const TypingEffect = memo(({ words, speed = 100, loop = true }) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const type = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        if (charIndex > 0) {
          setText(currentWord.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      } else {
        if (charIndex < currentWord.length) {
          setText(currentWord.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          if (loop) {
            setTimeout(() => setIsDeleting(true), 1000);
          }
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex, words, speed, loop]);

  return <span className="typing-text">{text}</span>;
});

// Hay Chatbot Component
const HayChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'Hay', text: 'Hello! I’m Hay, your advanced AI assistant powered by Grok for DataToyAI. Ask me anything about data cleaning, analytics, or predictive modeling!' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  // Use environment variable for API key
  const API_KEY = process.env.XAI_API_KEY || 'xai-clgceSmL1twlI8XSyXC4pvs3xWx38F8MdVeFp4oiTHwIFF9sLPDicaettsOW6cZshBHUUH3N3KfaeMGR';

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'You', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare conversation history for context
    const apiMessages = messages.map((msg) => ({
      role: msg.sender === 'Hay' ? 'assistant' : 'user',
      content: msg.text,
    })).concat({ role: 'user', content: input });

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'grok',
          messages: [
            { role: 'system', content: 'You are Hay, an advanced AI assistant for DataToyAI, designed to provide professional, detailed, and context-aware answers on data cleaning, analytics, predictive modeling, and related topics. Respond like Grok 4 with deep reasoning, concise yet comprehensive insights, practical examples, step-by-step guidance, and a helpful tone.' },
            ...apiMessages,
          ],
          max_tokens: 500, // Increased for detailed Grok 4-like responses
          temperature: 0.6, // Balanced for coherent, professional responses
          top_p: 0.9, // Focus on high-probability tokens for quality
          frequency_penalty: 0.2, // Reduce repetition for better flow
          presence_penalty: 0.2, // Encourage diverse responses
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const grokResponse = data.choices[0].message.content.trim();
      setMessages((prev) => [...prev, { sender: 'Hay', text: grokResponse }]);
    } catch (error) {
      console.error('Error fetching from xAI API:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'Hay', text: 'Apologies, an error occurred. Please try again later or visit the "How It Works" section for assistance.' },
      ]);
    } finally {
      setIsLoading(false);
      // Scroll to bottom of chat
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-8 right-8 p-4 bg-neon-cyan text-cosmic-black rounded-full shadow-lg z-50 chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.button>
      <motion.div
        className="fixed bottom-20 right-8 w-80 h-96 bg-cosmic-black bg-opacity-90 backdrop-blur-md border border-neon-cyan rounded-lg shadow-xl z-50 flex flex-col chatbot-panel"
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={chatPanelVariants}
      >
        <div className="flex justify-between items-center p-4 border-b border-gold">
          <h3 className="text-lg font-playfair text-gold">Hay - AI Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="text-gold hover:text-neon-cyan">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto chat-history">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'You' ? 'bg-neon-cyan text-cosmic-black' : 'bg-dark-gray text-silver-white'
                }`}
              >
                <p className="text-sm font-inter">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[70%] p-3 rounded-lg bg-dark-gray text-silver-white">
                <p className="text-sm font-inter">Thinking...</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gold flex items-center">
          <textarea
            className="flex-1 p-2 bg-transparent border border-gold rounded-lg text-silver-white resize-none focus:outline-none focus:border-neon-cyan"
            rows="2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Hay anything..."
            disabled={isLoading}
          />
          <motion.button
            className="ml-2 p-2 bg-gold text-cosmic-black rounded-lg"
            onClick={handleSend}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scrolling logic for testimonials
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-cosmic-black text-silver-white main-container">
      <header>
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 bg-cosmic-black bg-opacity-80 backdrop-blur-md border-b border-neon-cyan"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="#home" className="logo">
              <svg className="logo-icon" viewBox="0 0 48 48" fill="none">
                <title>DataToyAI Logo</title>
                <circle cx="24" cy="24" r="18" stroke="url(#gold-gradient)" strokeWidth="2" />
                <path d="M24 12a12 12 0 0112 12 12 12 0 01-12 12 12 12 0 01-12-12 12 12 0 0112-12z" fill="none" stroke="url(#cyan-gradient)" strokeWidth="1" />
                <circle cx="18" cy="18" r="2" fill="#FFD700" />
                <circle cx="30" cy="18" r="2" fill="#00DDEB" />
                <circle cx="18" cy="30" r="2" fill="#00DDEB" />
                <circle cx="30" cy="30" r="2" fill="#FFD700" />
                <path d="M18 18l6 6m0 0l6-6m-6 6l6 6m-6-6l-6 6" stroke="#E8ECEF" strokeWidth="1" />
                <defs>
                  <linearGradient id="gold-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFD700" />
                    <stop offset="1" stopColor="#E8ECEF" />
                  </linearGradient>
                  <linearGradient id="cyan-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00DDEB" />
                    <stop offset="1" stopColor="#E8ECEF" />
                  </linearGradient>
                </defs>
              </svg>
            </a>
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="text-silver-white hover:text-neon-cyan font-inter">Home</a>
              <a href="#features" className="text-silver-white hover:text-neon-cyan font-inter">Features</a>
              <a href="#how-it-works" className="text-silver-white hover:text-neon-cyan font-inter">How It Works</a>
              <a href="#testimonials" className="text-silver-white hover:text-neon-cyan font-inter">Testimonials</a>
              <a href="#benefits" className="text-silver-white hover:text-neon-cyan font-inter">Benefits</a>
              <a href="#cta" className="text-silver-white hover:text-neon-cyan font-inter">Get Started</a>
            </div>
            <button
              className="md:hidden text-gold focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
          <motion.div
            className="md:hidden bg-cosmic-black bg-opacity-90"
            initial="hidden"
            animate={isMobileMenuOpen ? 'visible' : 'hidden'}
            variants={mobileMenuVariants}
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              <a href="#home" className="text-silver-white hover:text-neon-cyan font-inter" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
              <a href="#features" className="text-silver-white hover:text-neon-cyan font-inter" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-silver-white hover:text-neon-cyan font-inter" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
              <a href="#testimonials" className="text-silver-white hover:text-neon-cyan font-inter" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
              <a href="#benefits" className="text-silver-white hover:text-neon-cyan font-inter" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
              <a href="#cta" className="text-silver-white hover:text-neon-cyan font-inter" onClick={() => setIsMobileMenuOpen(false)}>Get Started</a>
            </div>
          </motion.div>
        </motion.nav>
      </header>

      <main>
        <motion.section
          id="home"
          className="h-screen relative flex flex-col items-center justify-center text-center hero-section-background"
          initial="hidden"
          animate="visible"
          style={{ opacity: heroOpacity }}
        >
          <DataSphere />
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center"
            variants={heroVariants}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-playfair text-gold mb-4 hero-title"
              animate={{
                textShadow: [
                  '0 0 10px rgba(255, 215, 0, 0.7)',
                  '0 0 20px rgba(255, 215, 0, 0.9)',
                  '0 0 10px rgba(255, 215, 0, 0.7)',
                ],
                transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              DataToyAI
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl font-inter text-silver-white max-w-3xl mx-auto mb-8"
              variants={heroVariants}
            >
              <TypingEffect
                words={["Clean Data with AI", "Unlock Stellar Insights", "Predict the Future"]}
                speed={80}
                loop={true}
              />
            </motion.p>
            <motion.button
              className="px-8 py-4 bg-gold text-cosmic-black font-inter rounded-lg shadow-lg text-lg font-medium shiny-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Start Cleaning Your Data
            </motion.button>
          </motion.div>
        </motion.section>

        <section id="features" className="py-16 px-4 bg-cosmic-black">
          <h2 className="text-4xl font-playfair text-gold text-center mb-12">Why Choose DataToyAI?</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ title, desc }, index) => (
              <Tilt key={title} tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.3} glareColor="#00DDEB">
                <motion.div
                  className="p-6 glass-card"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  variants={cardVariants}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-playfair text-gold mb-4">{title}</h3>
                  <p className="text-silver-white font-inter">{desc}</p>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-16 px-4 bg-gradient-to-b from-cosmic-black to-dark-gray">
          <h2 className="text-4xl font-playfair text-gold text-center mb-12">How DataToyAI Works</h2>
          <div className="max-w-6xl mx-auto space-y-8">
            {howItWorksSteps.map(({ step, title, desc }, index) => (
              <motion.div
                key={step}
                className="p-6 glass-card how-it-works-card"
                data-step={step}
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-playfair text-gold mb-2">{title}</h3>
                <p className="text-silver-white font-inter">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="testimonials"
          className="py-16 px-4 bg-gradient-to-b from-dark-gray to-cosmic-black overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <h2 className="text-4xl font-playfair text-gold text-center mb-12">What Users Are Doing with DataToyAI</h2>
          <div className="max-w-6xl mx-auto relative testimonial-carousel-wrapper">
            <div className="testimonial-carousel-container">
              {testimonials.map((testimonial, index) => {
                const offset = index - currentTestimonial;
                return (
                  <motion.div
                    key={index}
                    className="p-6 glass-card testimonial-card"
                    animate={{
                      x: `calc(-50% + ${offset * 340}px)`,
                      scale: offset === 0 ? 1.05 : 0.85,
                      rotateY: offset * -25,
                      opacity: Math.abs(offset) > 1 ? 0 : 1,
                      zIndex: testimonials.length - Math.abs(offset),
                      boxShadow: offset === 0 ? '0 0 20px rgba(0, 221, 235, 0.8)' : '0 8px 32px rgba(0, 0, 0, 0.2)',
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  >
                    <h3 className="text-xl font-playfair text-gold mb-4">{testimonial.title}</h3>
                    <p className="text-silver-white font-inter">{testimonial.desc}</p>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Navigation Arrows */}
            <motion.button
              onClick={() => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
              className="carousel-arrow left-arrow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
              className="carousel-arrow right-arrow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Navigation Dots */}
            <div className="carousel-dots-container">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`carousel-dot ${currentTestimonial === index ? 'active' : ''}`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="py-16 px-4 bg-cosmic-black">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-playfair text-gold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
              viewport={{ once: true }}
            >
              Get Started with DataToyAI Today
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl font-inter text-silver-white mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }}
              viewport={{ once: true }}
            >
              Upload your dataset, clean it with AI precision, and unlock powerful insights and predictions in minutes. Try DataToyAI now and transform your data workflow.
            </motion.p>
            <motion.a
              href="https://app.datatoyai.com"
              className="inline-block px-8 py-4 bg-gold text-cosmic-black font-inter rounded-lg shadow-lg text-lg font-medium shiny-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Try DataToyAI Now
            </motion.a>
          </div>
        </section>

        <section id="benefits" className="py-16 px-4 bg-cosmic-black">
          <h2 className="text-4xl font-playfair text-gold text-center mb-12">Why Choose DataToyAI</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map(({ icon, title, desc }, index) => (
              <motion.div
                key={title}
                className="p-6 glass-card"
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true }}
              >
                <div className="mb-4">{icon}</div>
                <h3 className="text-xl font-playfair text-gold mb-4">{title}</h3>
                <p className="text-silver-white font-inter">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <HayChatbot />
      </main>

      <footer className="py-8 bg-cosmic-black border-t border-gold">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-silver-white font-inter mb-4">
            © 2025 DataToyAI. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://discord.com" className="text-gold hover:text-neon-cyan font-inter">Join Our Community</a>
            <a href="https://docs.datatoyai.com" className="text-gold hover:text-neon-cyan font-inter">Documentation</a>
            <a href="mailto:info@datatoyai.com" className="text-gold hover:text-neon-cyan font-inter">Contact Us</a>
          </div>
          <p className="text-silver-white font-inter">
            Follow us on{' '}
            <a href="https://twitter.com/datatoyai" className="text-gold hover:text-neon-cyan">Twitter</a> |{' '}
            <a href="https://linkedin.com/company/datatoyai" className="text-gold hover:text-neon-cyan">LinkedIn</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;