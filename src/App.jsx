import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// DataSphere Component
const DataSphere = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const nodes = [];
    const numNodes = 35;
    const sphereRadius = Math.min(canvas.width, canvas.height) * 0.35;

    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      nodes.push({
        id: i,
        x: sphereRadius * Math.cos(theta) * Math.sin(phi),
        y: sphereRadius * Math.sin(theta) * Math.sin(phi),
        z: sphereRadius * Math.cos(phi),
        baseX: sphereRadius * Math.cos(theta) * Math.sin(phi),
        baseY: sphereRadius * Math.sin(theta) * Math.sin(phi),
        baseZ: sphereRadius * Math.cos(phi),
        color: ['#FFD700', '#E8ECEF', '#00DDEB'][Math.floor(Math.random() * 3)],
        size: Math.random() * 2 + 1.5,
        pulseOffset: Math.random() * Math.PI * 2,
        orbitAngle: Math.random() * Math.PI * 2,
      });
    }

    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5);
      gradient.addColorStop(0, 'rgba(2, 2, 10, 0.3)');
      gradient.addColorStop(0.3, 'rgba(0, 20, 40, 0.5)');
      gradient.addColorStop(0.6, 'rgba(0, 30, 50, 0.6)');
      gradient.addColorStop(1, 'rgba(2, 2, 10, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 0.9;
        const alpha = Math.random() * 0.5 + 0.4;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 236, 239, ${alpha})`;
        ctx.fill();
      }
      ctx.restore();

      angle += 0.002;
      nodes.forEach(node => {
        node.orbitAngle += 0.005;
        node.baseX = sphereRadius * Math.cos(node.orbitAngle);
        node.baseY = sphereRadius * Math.sin(node.orbitAngle) * 0.5;
      });

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      nodes.forEach(node => {
        const rotX = Math.cos(angle) * node.baseX - Math.sin(angle) * node.baseZ;
        const rotZ = Math.sin(angle) * node.baseX + Math.cos(angle) * node.baseZ;
        node.x = rotX;
        node.z = rotZ;

        const scale = 800 / (800 + node.z);
        const x2d = node.x * scale;
        const y2d = node.y * scale;

        const pulse = Math.sin(Date.now() * 0.002 + node.pulseOffset) * 0.5 + 0.5;
        const currentSize = node.size + pulse * 2;

        ctx.beginPath();
        ctx.arc(x2d, y2d, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = node.color === '#FFD700' ? `rgba(255, 215, 0, ${0.7 + pulse * 0.3})` :
                        node.color === '#E8ECEF' ? `rgba(232, 236, 239, ${0.6 + pulse * 0.3})` :
                        `rgba(0, 221, 235, ${0.6 + pulse * 0.3})`;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10 + pulse * 10;
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

          if (dist < sphereRadius * 0.8) {
            const scaleI = 800 / (800 + ni.z);
            const scaleJ = 800 / (800 + nj.z);
            const x1 = ni.x * scaleI;
            const y1 = ni.y * scaleI;
            const x2 = nj.x * scaleJ;
            const y2 = nj.y * scaleJ;

            const opacity = Math.max(0, 0.7 - dist / (sphereRadius * 1.2)) * (Math.sin(Date.now() * 0.001 + i + j) * 0.4 + 0.6);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(0, 221, 235, ${opacity * 0.7})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="data-sphere" />;
};

// TypingEffect Component
const TypingEffect = ({ words, speed = 100, loop = true }) => {
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
          setWordIndex((wordIndex + 1) % words.length);
        }
      } else {
        if (charIndex < currentWord.length) {
          setText(currentWord.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex, words, speed]);

  return <span className="typing-text">{text}</span>;
};

function App() {
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 }, boxShadow: '0 0 20px rgba(0, 221, 235, 0.8)' },
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

  return (
    <div className="min-h-screen bg-cosmic-black text-silver-white main-container">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-cosmic-black bg-opacity-80 backdrop-blur-md border-b border-neon-cyan"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#" className="logo">
            <svg className="logo-icon" viewBox="0 0 48 48" fill="none">
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
          <div className="flex space-x-6">
            <a href="#home" className="text-silver-white hover:text-neon-cyan font-inter">Home</a>
            <a href="#features" className="text-silver-white hover:text-neon-cyan font-inter">Features</a>
            <a href="#how-it-works" className="text-silver-white hover:text-neon-cyan font-inter">How It Works</a>
            <a href="#testimonials" className="text-silver-white hover:text-neon-cyan font-inter">Testimonials</a>
            <a href="#benefits" className="text-silver-white hover:text-neon-cyan font-inter">Benefits</a>
            <a href="#cta" className="text-silver-white hover:text-neon-cyan font-inter">Get Started</a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        id="home"
        className="h-screen relative flex flex-col items-center justify-center text-center hero-section-background"
        initial="hidden"
        animate="visible"
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
            className="px-8 py-4 bg-gold text-cosmic-black font-inter rounded-lg shadow-lg text-lg font-medium hero-button"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Start Cleaning Your Data
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-cosmic-black">
        <h2 className="text-4xl font-playfair text-gold text-center mb-12">Why Choose DataToyAI?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="p-6 glass-card"
            custom={0}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">AI-Driven Data Cleaning</h3>
            <p className="text-silver-white font-inter">
              Clean your datasets effortlessly with AI-powered suggestions, anomaly detection, and smart workflows. Handle missing values, duplicates, and more with precision.
            </p>
          </motion.div>
          <motion.div
            className="p-6 glass-card"
            custom={1}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">Predictive Analytics</h3>
            <p className="text-silver-white font-inter">
              Unlock the future with time series forecasting, clustering, and one-click ML model training. Generate synthetic data and visualize feature importance with ease.
            </p>
          </motion.div>
          <motion.div
            className="p-6 glass-card"
            custom={2}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">AI Chat Assistant</h3>
            <p className="text-silver-white font-inter">
              Get instant answers to data-related questions with our AI-powered chat assistant, designed to guide you through analysis and provide actionable insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-gradient-to-b from-cosmic-black to-dark-gray">
        <h2 className="text-4xl font-playfair text-gold text-center mb-12">How DataToyAI Works</h2>
        <div className="max-w-6xl mx-auto space-y-8">
          {[
            { step: 1, title: "Upload Your Dataset", desc: "Start by uploading your CSV or Excel file (up to 200MB). Preview the first 10 rows and view metadata like rows, columns, and data health." },
            { step: 2, title: "Clean with AI Precision", desc: "Use AI-driven suggestions to handle missing values, outliers, and duplicates, or apply manual cleaning tools like encoding and geolocation enrichment." },
            { step: 3, title: "Discover Actionable Insights", desc: "Generate natural language insights powered by AI, such as correlations and trends, to understand your data better." },
            { step: 4, title: "Create Dynamic Visualizations", desc: "Build interactive charts like scatter plots, heatmaps, and time series forecasts to explore your data visually." },
            { step: 5, title: "Leverage Predictive Analytics", desc: "Forecast trends, generate synthetic data, or train machine learning models with one-click deployment for powerful predictions." },
          ].map(({ step, title, desc }, index) => (
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

      {/* Call-to-Action Section */}
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
            className="inline-block px-8 py-4 bg-gold text-cosmic-black font-inter rounded-lg shadow-lg text-lg font-medium cta-button"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Try DataToyAI Now
          </motion.a>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gradient-to-b from-dark-gray to-cosmic-black">
        <h2 className="text-4xl font-playfair text-gold text-center mb-12">What Users Are Doing with DataToyAI</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Healthcare Insights", desc: "Analyzed thyroid patient data, cleaned missing values with AI suggestions, and visualized correlations to identify key health trends." },
            { title: "Business Forecasting", desc: "Uploaded sales data, used time series forecasting to predict future trends, and created interactive charts for stakeholder presentations." },
            { title: "Data Science Research", desc: "Generated synthetic datasets for classification tasks and trained ML models with one-click deployment to accelerate research." },
          ].map(({ title, desc }, index) => (
            <motion.div
              key={title}
              className="p-6 glass-card"
              custom={index}
              initial="hidden"
              whileInView="visible"
              variants={cardVariants}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-playfair text-gold mb-4">{title}</h3>
              <p className="text-silver-white font-inter">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-cosmic-black">
        <h2 className="text-4xl font-playfair text-gold text-center mb-12">Why Choose DataToyAI</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: (
                <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "AI-Driven Efficiency",
              desc: "Streamline data cleaning with AI suggestions, automating tasks like handling missing values and detecting outliers."
            },
            {
              icon: (
                <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
              title: "Intuitive Interface",
              desc: "Enjoy a user-friendly platform with undo/redo, templates, and pagination for seamless data management."
            },
            {
              icon: (
                <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: "Versatile Visualizations",
              desc: "Create dynamic charts, from heatmaps to 3D scatter plots, to explore your data with ease."
            },
            {
              icon: (
                <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
              ),
              title: "Advanced Analytics",
              desc: "Unlock predictive power with time series forecasting, clustering, and one-click ML model training."
            },
          ].map(({ icon, title, desc }, index) => (
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

      {/* Footer */}
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