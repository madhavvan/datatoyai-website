import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

function App() {
  const heroVariants = {
    hidden: { opacity: 0, y: 50, rotateY: -90 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0, 
      transition: { 
        duration: 1, 
        ease: "easeOut",
        rotateY: { duration: 1.5, ease: "easeInOut" }
      } 
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#FFD700", "#D3D3D3"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
      },
      size: {
        value: { min: 1, max: 5 },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#D3D3D3",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          quantity: 4,
        },
      },
    },
    background: {
      color: "transparent",
    },
  };

  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  const handleMouseMove = (e) => {
    if (isHoveringHero) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left - 10,
        y: e.clientY - rect.top - 10,
      });
    }
  };

  const handleMouseEnter = () => setIsHoveringHero(true);
  const handleMouseLeave = () => {
    setIsHoveringHero(false);
    setCursorPosition({ x: -100, y: -100 });
  };

  return (
    <div className="min-h-screen bg-deep-black text-white">
      {/* Hero Section */}
      <motion.section
        className="h-screen relative flex flex-col items-center justify-center text-center bg-gradient-to-br from-dark-gray to-deep-black"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Particles
          className="absolute inset-0 z-0"
          init={particlesInit}
          options={particlesOptions}
        />
        <motion.div
          className="absolute w-5 h-5 bg-gold rounded-full pointer-events-none z-20"
          animate={{ x: cursorPosition.x, y: cursorPosition.y }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          style={{ boxShadow: "0 0 10px rgba(255, 215, 0, 0.7)" }}
        />
        <motion.h1
          className="text-6xl md:text-8xl font-playfair text-gold mb-4 z-10"
          variants={heroVariants}
          style={{ transformStyle: "preserve-3d" }}
        >
          DataToyAI
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl font-inter text-silver mb-8 z-10"
          variants={heroVariants}
        >
          Unleashing the Power of AI with Elegance
        </motion.p>
        <motion.button
          className="px-6 py-3 bg-gold text-deep-black font-inter rounded-lg shadow-lg z-10"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Discover More
        </motion.button>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-playfair text-gold text-center mb-12">Our Features</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            className="p-6 bg-dark-gray rounded-lg shadow-lg feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">AI-Powered Insights</h3>
            <p className="text-silver font-inter">
              Leverage cutting-edge AI to gain deep insights and make informed decisions.
            </p>
          </motion.div>
          {/* Feature 2 */}
          <motion.div
            className="p-6 bg-dark-gray rounded-lg shadow-lg feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">Seamless Integration</h3>
            <p className="text-silver font-inter">
              Integrate effortlessly with your existing systems for a smooth experience.
            </p>
          </motion.div>
          {/* Feature 3 */}
          <motion.div
            className="p-6 bg-dark-gray rounded-lg shadow-lg feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">Luxurious Design</h3>
            <p className="text-silver font-inter">
              Experience a premium design that reflects the sophistication of AI innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-deep-black border-t border-gold">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-silver font-inter">
            © 2025 DataToyAI. All rights reserved.
          </p>
          <p className="text-silver font-inter mt-2">
            Contact us at <a href="mailto:info@datatoyai.com" className="text-gold hover:underline">info@datatoyai.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
