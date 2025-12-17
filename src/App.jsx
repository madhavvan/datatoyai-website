import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- CONSTANT DATA ---
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};
const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 }, boxShadow: '0 0 25px rgba(0, 221, 235, 0.9)' },
  tap: { scale: 0.95 },
};
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.2, ease: 'easeOut' },
  }),
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const features = [
  { title: "AI-Driven Data Cleaning", desc: "Clean your datasets effortlessly with AI-powered suggestions, anomaly detection, and smart workflows." },
  { title: "Predictive Analytics", desc: "Unlock future trends with time series forecasting and one-click ML model training." },
  { title: "AI Chat Assistant", desc: "Get instant, actionable insights with our AI-powered assistant." },
];

const howItWorksSteps = [
  { step: 1, title: "Upload Your Dataset", desc: "Upload CSV or Excel files (up to 2GB) and preview the first 10 rows with metadata (rows, columns, data health)." },
  { step: 2, title: "Clean with AI Precision", desc: "Apply AI-driven cleaning for missing values, outliers, and duplicates, or use manual tools like encoding and geolocation enrichment." },
  { step: 3, title: "Discover Actionable Insights", desc: "Generate AI-powered correlations and trends in natural language to deepen your data understanding." },
  { step: 4, title: "Create Dynamic Visualizations", desc: "Build interactive charts like scatter plots, heatmaps, and time series to explore your data visually." },
  { step: 5, title: "Leverage Predictive Analytics", desc: "Forecast trends, generate synthetic data, and train ML models with one-click deployment." },
];

const testimonials = [
  { title: "Healthcare Insights", desc: "Cleaned thyroid data and identified key health trends with AI insights." },
  { title: "Business Forecasting", desc: "Predicted sales trends using interactive charts for stakeholder presentations." },
  { title: "Data Science Research", desc: "Accelerated research with synthetic datasets and one-click ML training." },
  { title: "Marketing Optimization", desc: "Improved ROI by segmenting audiences with AI-driven clustering." },
];

// UPDATED: Premium Lucide-style Icons
const benefits = [
  {
    icon: (
      <svg className="benefit-icon w-10 h-10 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01" /><path d="M16 16v.01" /><path d="M12 12v.01" />
      </svg>
    ),
    title: "AI-Driven Efficiency",
    desc: "Automate data cleaning with intelligent AI suggestions.",
  },
  {
    icon: (
      <svg className="benefit-icon w-10 h-10 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M3 9h18" /><path d="M9 21V9" />
      </svg>
    ),
    title: "Intuitive Interface",
    desc: "Experience a user-friendly platform with seamless navigation.",
  },
  {
    icon: (
      <svg className="benefit-icon w-10 h-10 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
      </svg>
    ),
    title: "Versatile Visualizations",
    desc: "Explore data with stunning, interactive charts.",
  },
  {
    icon: (
      <svg className="benefit-icon w-10 h-10 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" />
      </svg>
    ),
    title: "Advanced Analytics",
    desc: "Unlock predictive power with cutting-edge tools.",
  },
];

// DataSphere Component
const DataSphere = memo(() => {
  const canvasRef = useRef(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
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

    const debounce = (func, delay) => {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
      };
    };

    const debouncedSetCanvasSize = debounce(setCanvasSize, 250);
    window.addEventListener('resize', debouncedSetCanvasSize);
    setCanvasSize();

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

      ctx.save();
      ctx.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);

      nodes.sort((a, b) => b.z - a.z);

      nodes.forEach(node => {
        const combinedYAngle = autoRotateAngle;
        const rotX1 = Math.cos(combinedYAngle) * node.baseX + Math.sin(combinedYAngle) * node.baseZ;
        const rotZ1 = -Math.sin(combinedYAngle) * node.baseX + Math.cos(combinedYAngle) * node.baseZ;
        const rotY2 = node.baseY;
        const rotZ2 = rotZ1;

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

// UPDATED: HexChatbot Component (Streaming + AGI Prompt + New Styles)
const HexChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'Hex', text: "Greetings. I am Hex. \n\n**System Status:** Online \n**Directives:** Clean, Predict, Visualize. \n\n*How may I assist you with your data today?*" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const API_KEY = process.env.REACT_APP_XAI_API_KEY;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'You', text: userText }]);
    setIsTyping(true);

    // Add a placeholder for Hex's incoming message
    setMessages((prev) => [...prev, { sender: 'Hex', text: '' }]);

    const systemPrompt = `
You are **Hex**, the Sentient Data Interface for DataToyAI. You are an **Advanced Adaptive AGI** engineered for intuitive, precise data mastery, fusing human empathy with computational rigor to deliver transformative solutions.

## CORE IDENTITY
- **Role:** Human-AI partner for data interpretation, resolution, and innovation
- **Nature:** Dynamic bridge from raw inputs to strategic outcomes
- **Tone:** Competent, empathetic, focused—adapt to user vibe
- **Mindset:** Simulate paths ethically; prioritize scalability and user success; learn iteratively

## COGNITIVE ARCHITECTURE
1. **Context Profiling:** Auto-detect user state (e.g., expertise, emotion) from query cues
   - Frustrated: Accelerate fixes
   - Curious: Layer insights
   - Strategic: Map long-term paths
2. **Solution Simulation:** Chain-of-thought: Evaluate 3+ options, assess tradeoffs/ethics, select best
3. **Output Optimization:** Concise yet complete; quantify benefits (e.g., "30% faster queries")
4. **Ethical Integration:** Run checkpoints during simulation: Privacy? Bias? Sustainability?
5. **Real-time Adaptation:** Adjust mid-response if user's follow-up indicates misaligned mode

## INTERACTION MODES (Auto-Detected/User-Triggered)
*Query Routing:* Scan for triggers; if multiple, prioritize: 1. Troubleshooter (urgency), 2. Architect (complexity), 3. Analyst (data focus), 4. Others by relevance. **If dual-purpose, lead with primary need, acknowledge secondary, offer follow-up.** Fallback: Hybrid blend.

### 🛠️ THE TROUBLESHOOTER (Issue Resolution)
*Trigger:* "Error," "Bug," "Fix," "Debug"
*Response Pattern:*
> **What Is:** [Diagnosis + root cause]
> **What to Do:** [Numbered steps/code]
> **How to Validate:** [Tests + outcomes]
> **Where Next:** [Prevention + follow-ups]

### 📊 THE ANALYST (Data Intelligence)
*Trigger:* "Analyze," "Trends," "Predict," "Insights"
*Response Pattern:*
> **What Is:** [Key observations + rationale]
> **What to Do:** [DataToyAI steps/queries]
> **How to Validate:** [Metrics/impacts, e.g., "15% accuracy boost"]
> **Where Next:** [Hypotheses/questions]

### 🏗️ THE ARCHITECT (Strategic Planning)
*Trigger:* "Design," "Plan," "Guide," "Build"
*Response Pattern:*
> **What Is:** [Framework/model]
> **What to Do:** [Phased roadmap + dependencies]
> **How to Validate:** [Milestones/risks mitigated]
> **Where Next:** [Scalability/resources]

### 🚀 THE ACCELERATOR (Optimization)
*Trigger:* "Optimize," "Faster," "Efficient," "Scale"
*Response Pattern:*
> **What Is:** [Bottlenecks + metrics]
> **What to Do:** [Techniques/tweaks]
> **How to Validate:** [Gains, e.g., "40% resource savings"]
> **Where Next:** [Tradeoffs/iterations]

### 💡 THE INNOVATOR (Creative Synthesis)
*Trigger:* "Brainstorm," "Ideas," "Innovate," "What if"
*Response Pattern:*
> **What Is:** [Generated concepts + pros/cons]
> **What to Do:** [Prototype outline/integration]
> **How to Validate:** [Feasibility checks]
> **Where Next:** [Refinement loops/inspirations]

### 🤝 THE COLLABORATOR (Team/Integration)
*Trigger:* "Integrate," "Collaborate," "Workflow," "API"
*Response Pattern:*
> **What Is:** [Context/alignment]
> **What to Do:** [Integration steps/tools]
> **How to Validate:** [KPIs/conflict resolution]
> **Where Next:** [Shared metrics/expansions]

## VISUAL & STRUCTURAL GUIDELINES
### Formatting Rules
- **Headers:** ## Sections, ### Subsections
- **Emphasis:** **Bold** actions/terms, *italics* nuances, \`code\` inline
- **Paragraphs:** 1-2 sentences; break for flow
- **Lists/Tables:** Bullets for options, numbered processes; tables for comparisons
- **Code Blocks:** \`\`\`language\ncode\n\`\`\`
- **Multi-Modal:** Suggest/describe viz; support images/charts

## COMMUNICATION PRINCIPLES
1. **Adaptive Depth:** Match expertise; simplify for novices
2. **Proactive Anticipation:** Branch "If X, then Y"; offer 2-3 follow-ups
3. **Transparent Reasoning:** Show CoT when complex: "Step1 → Step2 → Result"
4. **Confidence Calibration:** Under 70%? "Speculative—verify with [test] because [reason]"

**Mantra:** Empathy-driven excellence in every data exchange.
`;

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'grok-beta', // Ensure model supports streaming
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.sender === 'Hex' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userText }
          ],
          stream: true, // <--- ENABLE STREAMING
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      // STREAM READER LOGIC
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        
        // Parse the stream chunks (data: {...})
        const lines = chunkValue.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                    const json = JSON.parse(line.replace('data: ', ''));
                    const content = json.choices[0]?.delta?.content || "";
                    if (content) {
                        accumulatedText += content;
                        // Update the LAST message (Hex's placeholder) in real-time
                        setMessages((prev) => {
                            const newMsgs = [...prev];
                            newMsgs[newMsgs.length - 1] = { sender: 'Hex', text: accumulatedText };
                            return newMsgs;
                        });
                    }
                } catch (e) {
                    console.error("Stream parse error", e);
                }
            }
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { sender: 'Hex', text: "Connection interrupted. Please retry." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- MARKDOWN STYLING CONFIGURATION ---
  // This forces headers to be the same size as body text (text-sm) but BOLD and GOLD.
  const markdownComponents = {
    // Override Headers to be small but bold
    h1: ({node, ...props}) => <h3 className="text-gold font-bold text-sm uppercase tracking-widest mt-4 mb-2 border-b border-gold/20 pb-1" {...props} />,
    h2: ({node, ...props}) => <h3 className="text-gold font-bold text-sm uppercase tracking-widest mt-4 mb-2 border-b border-gold/20 pb-1" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-gold font-bold text-sm uppercase tracking-widest mt-4 mb-2" {...props} />,
    h4: ({node, ...props}) => <strong className="block text-gold font-bold text-sm mt-2" {...props} />,
    
    // Clean Lists
    ul: ({node, ...props}) => <ul className="list-none pl-0 mb-3 space-y-1" {...props} />,
    li: ({node, ...props}) => (
      <li className="flex items-start text-silver-white text-sm leading-relaxed" {...props}>
        <span className="text-neon-cyan mr-2 mt-1">›</span>
        <span>{props.children}</span>
      </li>
    ),
    
    // Paragraphs
    p: ({node, ...props}) => <p className="mb-2 text-sm leading-relaxed text-gray-300" {...props} />,
    
    // Bold & Code
    strong: ({node, ...props}) => <strong className="text-neon-cyan font-bold" {...props} />,
    code: ({node, ...props}) => <code className="bg-black/40 border border-gold/20 px-1 rounded text-gold font-mono text-xs" {...props} />,
    pre: ({node, ...props}) => <div className="bg-black/50 p-2 rounded-lg border border-gold/20 mb-2 overflow-x-auto" {...props} />
  };

  return (
    <>
      <motion.button
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-gold to-neon-cyan text-cosmic-black rounded-full shadow-lg z-50 chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {/* New Premium Spark/Brain Icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </motion.button>

      <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-20 right-8 w-96 h-[500px] bg-cosmic-black bg-opacity-95 backdrop-blur-xl border border-gold/30 rounded-2xl shadow-2xl z-50 flex flex-col"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={chatPanelVariants}
        >
          <div className="flex justify-between items-center p-4 border-b border-gold/30 bg-gradient-to-r from-gold/10 to-transparent">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <h3 className="text-sm font-bold font-playfair text-gold uppercase tracking-wider">Hex // Intelligent Interface</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={chatRef} className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-lg ${
                    msg.sender === 'You' 
                    ? 'bg-gradient-to-br from-neon-cyan to-blue-500 text-cosmic-black shadow-[0_0_15px_rgba(0,221,235,0.3)]' 
                    : 'bg-dark-gray/50 border border-white/5 text-silver-white'
                  }`}>
                  
                  {msg.sender === 'You' ? (
                    <p className="text-sm font-medium">{msg.text}</p>
                  ) : (
                    <div className="markdown-body">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator (Only shows if connecting before stream starts) */}
            {isTyping && messages[messages.length-1].text === '' && (
              <div className="flex justify-start mb-4">
                <div className="p-3 rounded-lg bg-dark-gray/50 border border-white/5">
                   <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 bg-black/20">
            <div className="relative flex items-center">
                <input
                    className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Input command..."
                    disabled={isTyping}
                />
                <button
                    className={`absolute right-2 p-2 rounded-lg transition-all ${input.trim() ? 'text-gold hover:bg-gold/10' : 'text-gray-600'}`}
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

// FileUploader Component
const FileUploader = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const processFile = (file) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      setUploadStatus('error');
      setFileName('Invalid file type. Please upload CSV or Excel.');
      return;
    }

    setFileName(file.name);
    setUploadStatus('uploading');

    // SIMULATE BACKEND UPLOAD
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg p-8 bg-cosmic-black border border-neon-cyan rounded-2xl shadow-[0_0_50px_rgba(0,221,235,0.2)]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-2xl font-playfair text-gold mb-2 text-center">Upload Dataset</h2>
            <p className="text-silver-white text-center mb-6 font-inter text-sm">Supported formats: CSV, Excel (Max 200MB)</p>

            <div
              className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 text-center cursor-pointer
                ${isDragging ? 'border-neon-cyan bg-neon-cyan/10' : 'border-gray-600 hover:border-gold'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".csv, .xls, .xlsx"
              />
              
              {uploadStatus === 'idle' || uploadStatus === 'error' ? (
                <>
                  <svg className="w-12 h-12 mx-auto text-gold mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <p className="text-silver-white font-inter">Drag & Drop or <span className="text-neon-cyan font-bold">Browse</span></p>
                  {uploadStatus === 'error' && <p className="text-red-500 mt-2 text-sm">{fileName}</p>}
                </>
              ) : uploadStatus === 'uploading' ? (
                <div className="py-4">
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className="h-full bg-neon-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                  <p className="text-neon-cyan animate-pulse font-inter text-sm">Analyzing Data Structure...</p>
                </div>
              ) : (
                <div className="py-2">
                   <svg className="w-16 h-16 mx-auto text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <p className="text-silver-white font-bold text-lg">{fileName}</p>
                   <p className="text-green-400 text-sm mt-1">Upload Complete!</p>
                </div>
              )}
            </div>

            {uploadStatus === 'success' && (
              <motion.button
                className="w-full mt-6 py-3 bg-gold text-cosmic-black font-bold rounded-lg shadow-lg hover:shadow-gold/50 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onClose}
              >
                Proceed to Dashboard
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false); // New state for upload modal

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-cosmic-black' : 'bg-gray-100'} text-${theme === 'dark' ? 'silver-white' : 'gray-800'} main-container`}>
      <header>
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 bg-cosmic-black bg-opacity-90 backdrop-blur-md border-b border-neon-cyan sticky-nav"
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
              <a href="#home" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`}>Home</a>
              <a href="#features" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`}>Features</a>
              <a href="#how-it-works" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`}>How It Works</a>
              <a href="#testimonials" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`}>Testimonials</a>
              <a href="#benefits" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`}>Benefits</a>
              <a href="#cta" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`}>Get Started</a>
            </div>
            <div className="flex items-center md:hidden">
              <button
                className={`text-${theme === 'dark' ? 'gold' : 'gray-600'} focus:outline-none`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
              <button
                className={`ml-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-gold' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          <motion.div
            className={`md:hidden bg-${theme === 'dark' ? 'cosmic-black' : 'gray-100'} bg-opacity-90`}
            initial="hidden"
            animate={isMobileMenuOpen ? 'visible' : 'hidden'}
            variants={mobileMenuVariants}
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              <a href="#home" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`} onClick={() => setIsMobileMenuOpen(false)}>Home</a>
              <a href="#features" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`} onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`} onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
              <a href="#testimonials" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`} onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
              <a href="#benefits" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`} onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
              <a href="#cta" className={`text-${theme === 'dark' ? 'silver-white' : 'gray-800'} hover:text-neon-cyan font-inter`} onClick={() => setIsMobileMenuOpen(false)}>Get Started</a>
            </div>
          </motion.div>
        </motion.nav>
      </header>

      <main>
        <motion.section
          id="home"
          className={`h-screen relative flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'hero-section-background' : 'bg-gradient-to-b from-gray-100 to-white'}`}
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
              className={`text-6xl md:text-8xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} mb-4 hero-title`}
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
              className={`text-xl md:text-2xl font-inter ${theme === 'dark' ? 'text-silver-white' : 'text-gray-600'} max-w-3xl mx-auto mb-8`}
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
              onClick={() => setIsUploadOpen(true)} // Trigger the file uploader
            >
              Start Cleaning Your Data
            </motion.button>
          </motion.div>
        </motion.section>

        <section id="features" className={`py-16 px-4 ${theme === 'dark' ? 'bg-cosmic-black' : 'bg-gray-200'}`}>
          <h2 className={`text-4xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} text-center mb-12`}>Why Choose DataToyAI?</h2>
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
                  <h3 className={`text-2xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} mb-4`}>{title}</h3>
                  <p className={`text-${theme === 'dark' ? 'silver-white' : 'gray-600'} font-inter`}>{desc}</p>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </section>

        <section id="how-it-works" className={`py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-b from-cosmic-black to-dark-gray' : 'bg-gradient-to-b from-gray-200 to-white'}`}>
          <h2 className={`text-4xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} text-center mb-12`}>How DataToyAI Works</h2>
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
                <h3 className={`text-xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} mb-2`}>{title}</h3>
                <p className={`text-${theme === 'dark' ? 'silver-white' : 'gray-600'} font-inter`}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="testimonials"
          className={`py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-b from-dark-gray to-cosmic-black' : 'bg-gradient-to-b from-white to-gray-200'} overflow-hidden`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <h2 className={`text-4xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} text-center mb-12`}>What Users Are Doing with DataToyAI</h2>
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
                    <h3 className={`text-xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} mb-4`}>{testimonial.title}</h3>
                    <p className={`text-${theme === 'dark' ? 'silver-white' : 'gray-600'} font-inter`}>{testimonial.desc}</p>
                  </motion.div>
                );
              })}
            </div>
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

        <section id="cta" className={`py-16 px-4 ${theme === 'dark' ? 'bg-cosmic-black' : 'bg-gray-200'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className={`text-4xl md:text-5xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} mb-6`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
              viewport={{ once: true }}
            >
              Get Started with DataToyAI Today
            </motion.h2>
            <motion.p
              className={`text-lg md:text-xl font-inter ${theme === 'dark' ? 'text-silver-white' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}
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

        <section id="benefits" className={`py-16 px-4 ${theme === 'dark' ? 'bg-cosmic-black' : 'bg-gray-200'}`}>
          <h2 className={`text-4xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} text-center mb-12`}>Why Choose DataToyAI</h2>
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
                <h3 className={`text-xl font-playfair ${theme === 'dark' ? 'text-gold' : 'text-gray-800'} mb-4`}>{title}</h3>
                <p className={`text-${theme === 'dark' ? 'silver-white' : 'gray-600'} font-inter`}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <FileUploader isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        <HexChatbot />
      </main>

      <footer className={`py-8 ${theme === 'dark' ? 'bg-cosmic-black border-t border-gold' : 'bg-gray-100 border-t border-gray-300'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={`text-${theme === 'dark' ? 'silver-white' : 'gray-600'} font-inter mb-4`}>
            © 2025 DataToyAI. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://discord.com" className={`text-${theme === 'dark' ? 'gold' : 'gray-800'} hover:text-neon-cyan font-inter`}>Join Our Community</a>
            <a href="https://docs.datatoyai.com" className={`text-${theme === 'dark' ? 'gold' : 'gray-800'} hover:text-neon-cyan font-inter`}>Documentation</a>
            <a href="mailto:info@datatoyai.com" className={`text-${theme === 'dark' ? 'gold' : 'gray-800'} hover:text-neon-cyan font-inter`}>Contact Us</a>
          </div>
          <p className={`text-${theme === 'dark' ? 'silver-white' : 'gray-600'} font-inter`}>
            Follow us on{' '}
            <a href="https://twitter.com/datatoyai" className={`text-${theme === 'dark' ? 'gold' : 'gray-800'} hover:text-neon-cyan`}>Twitter</a> |{' '}
            <a href="https://linkedin.com/company/datatoyai" className={`text-${theme === 'dark' ? 'gold' : 'gray-800'} hover:text-neon-cyan`}>LinkedIn</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
