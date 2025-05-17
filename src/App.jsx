import React, { useCallback } from 'react';
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

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2 },
    }),
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: {
        value: 50,
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
        value: 0.3,
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

  return (
    <div className="min-h-screen bg-deep-black text-white main-container">
      {/* Hero Section */}
      <motion.section
        className="h-screen relative flex flex-col items-center justify-center text-center bg-gradient-to-br from-dark-gray to-deep-black"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <Particles
          className="absolute inset-0 z-0"
          init={particlesInit}
          options={particlesOptions}
        />
        <motion.h1
          className="text-6xl md:text-8xl font-playfair text-gold mb-4 z-10 hero-title"
          variants={heroVariants}
          style={{ transformStyle: "preserve-3d" }}
        >
          DataToyAI
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl font-inter text-silver max-w-3xl mx-auto mb-8 z-10"
          variants={heroVariants}
        >
          Transform your data with AI-driven cleaning, insights, and predictive analytics. Streamline your workflow with elegance and precision.
        </motion.p>
        <motion.button
          className="px-8 py-4 bg-gold text-deep-black font-inter rounded-lg shadow-lg text-lg font-medium z-10 hero-button"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Start Cleaning Your Data
        </motion.button>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-playfair text-gold text-center mb-12">Why Choose DataToyAI?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: AI-Driven Data Cleaning */}
          <motion.div
            className="p-6 bg-dark-gray rounded-lg shadow-lg feature-card"
            custom={0}
            initial="hidden"
            whileInView="visible"
            variants={featureVariants}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">AI-Driven Data Cleaning</h3>
            <p className="text-silver font-inter">
              Clean your datasets effortlessly with AI-powered suggestions, anomaly detection, and smart workflows. Handle missing values, duplicates, and more with precision.
            </p>
          </motion.div>
          {/* Feature 2: Predictive Analytics */}
          <motion.div
            className="p-6 bg-dark-gray rounded-lg shadow-lg feature-card"
            custom={1}
            initial="hidden"
            whileInView="visible"
            variants={featureVariants}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">Predictive Analytics</h3>
            <p className="text-silver font-inter">
              Unlock the future with time series forecasting, clustering, and one-click ML model training. Generate synthetic data and visualize feature importance with ease.
            </p>
          </motion.div>
          {/* Feature 3: AI Chat Assistant */}
          <motion.div
            className="p-6 bg-dark-gray rounded-lg shadow-lg feature-card"
            custom={2}
            initial="hidden"
            whileInView="visible"
            variants={featureVariants}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair text-gold mb-4">AI Chat Assistant</h3>
            <p className="text-silver font-inter">
              Get instant answers to data-related questions with our AI-powered chat assistant, designed to guide you through analysis and provide actionable insights.
            </p>
          </motion.div>
        </div>
      </section>



      {/* How It Works Section */}
  <section className="py-16 px-4 bg-deep-black">
    <h2 className="text-4xl font-playfair text-gold text-center mb-12">How DataToyAI Works</h2>
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Step 1: Upload Dataset */}
      <motion.div
        className="p-6 bg-dark-gray rounded-lg shadow-lg how-it-works-card"
        data-step="1"
        custom={0}
        initial="hidden"
        whileInView="visible"
        variants={featureVariants}
        viewport={{ once: true }}
      >
      <h3 className="text-xl font-playfair text-gold mb-2"> Upload Your Dataset</h3>
      <p className="text-silver font-inter">
        Start by uploading your CSV or Excel file (up to 200MB). Preview the first 10 rows and view metadata like rows, columns, and data health.
      </p>
    </motion.div>
    {/* Step 2: Clean Data */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg how-it-works-card"
      data-step="2"
      custom={1}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-playfair text-gold mb-2"> Clean with AI Precision</h3>
      <p className="text-silver font-inter">
        Use AI-driven suggestions to handle missing values, outliers, and duplicates, or apply manual cleaning tools like encoding and geolocation enrichment.
      </p>
    </motion.div>
    {/* Step 3: Gain Insights */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg how-it-works-card"
      data-step="3"
      custom={2}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-playfair text-gold mb-2"> Discover Actionable Insights</h3>
      <p className="text-silver font-inter">
        Generate natural language insights powered by AI, such as correlations and trends, to understand your data better.
      </p>
    </motion.div>
    {/* Step 4: Visualize Data */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg how-it-works-card"
      data-step="4"
      custom={3}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-playfair text-gold mb-2"> Create Dynamic Visualizations</h3>
      <p className="text-silver font-inter">
        Build interactive charts like scatter plots, heatmaps, and time series forecasts to explore your data visually.
      </p>
    </motion.div>
    {/* Step : Predictive Analytics */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg how-it-works-card"
      data-step="5"
      custom={4}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-playfair text-gold mb-2"> Leverage Predictive Analytics</h3>
      <p className="text-silver font-inter">
        Forecast trends, generate synthetic data, or train machine learning models with one-click deployment for powerful predictions.
      </p>
    </motion.div>
  </div>
</section>
{/* Call-to-Action Section */}
<section className="py-16 px-4 bg-gradient-to-b from-dark-gray to-deep-black">
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
      className="text-lg md:text-xl font-inter text-silver mb-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }}
      viewport={{ once: true }}
    >
      Upload your dataset, clean it with AI precision, and unlock powerful insights and predictions in minutes. Try DataToyAI now and transform your data workflow.
    </motion.p>
    <motion.a
      href="#get-started" // Replace with actual link if applicable
      className="inline-block px-8 py-4 bg-gold text-deep-black font-inter rounded-lg shadow-lg text-lg font-medium cta-button"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
    >
      Try DataToyAI Now
    </motion.a>
  </div>
</section>
{/* Testimonials/Usage Examples Section */}
<section className="py-16 px-4 bg-deep-black">
  <h2 className="text-4xl font-playfair text-gold text-center mb-12">What Users Are Doing with DataToyAI</h2>
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Example 1: Healthcare Analysis */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg testimonial-card"
      custom={0}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-playfair text-gold mb-2">Healthcare Insights</h3>
      <p className="text-silver font-inter">
        Analyzed thyroid patient data, cleaned missing values with AI suggestions, and visualized correlations to identify key health trends.
      </p>
    </motion.div>
    {/* Example 2: Business Forecasting */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg testimonial-card"
      custom={1}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-playfair text-gold mb-2">Business Forecasting</h3>
      <p className="text-silver font-inter">
        Uploaded sales data, used time series forecasting to predict future trends, and created interactive charts for stakeholder presentations.
      </p>
    </motion.div>
    {/* Example 3: Data Science Research */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg testimonial-card"
      custom={2}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-playfair text-gold mb-2">Data Science Research</h3>
      <p className="text-silver font-inter">
        Generated synthetic datasets for classification tasks and trained ML models with one-click deployment to accelerate research.
      </p>
    </motion.div>
  </div>
</section>
{/* Key Benefits Section */}
<section className="py-16 px-4 bg-deep-black">
  <h2 className="text-4xl font-playfair text-gold text-center mb-12">Why Choose DataToyAI</h2>
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {/* Benefit 1: AI-Driven Efficiency */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg benefit-card"
      custom={0}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <div className="text-gold text-3xl mb-4">⚙️</div>
      <h3 className="text-xl font-playfair text-gold mb-2">AI-Driven Efficiency</h3>
      <p className="text-silver font-inter">
        Streamline data cleaning with AI suggestions, automating tasks like handling missing values and detecting outliers.
      </p>
    </motion.div>
    {/* Benefit 2: Intuitive Interface */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg benefit-card"
      custom={1}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <div className="text-gold text-3xl mb-4">🖥️</div>
      <h3 className="text-xl font-playfair text-gold mb-2">Intuitive Interface</h3>
      <p className="text-silver font-inter">
        Enjoy a user-friendly platform with undo/redo, templates, and pagination for seamless data management.
      </p>
    </motion.div>
    {/* Benefit 3: Versatile Visualizations */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg benefit-card"
      custom={2}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <div className="text-gold text-3xl mb-4">📊</div>
      <h3 className="text-xl font-playfair text-gold mb-2">Versatile Visualizations</h3>
      <p className="text-silver font-inter">
        Create dynamic charts, from heatmaps to 3D scatter plots, to explore your data with ease.
      </p>
    </motion.div>
    {/* Benefit 4: Advanced Analytics */}
    <motion.div
      className="p-6 bg-dark-gray rounded-lg shadow-lg benefit-card"
      custom={3}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <div className="text-gold text-3xl mb-4">🔍</div>
      <h3 className="text-xl font-playfair text-gold mb-2">Advanced Analytics</h3>
      <p className="text-silver font-inter">
        Unlock predictive power with time series forecasting, clustering, and one-click ML model training.
      </p>
    </motion.div>
  </div>
</section>
      {/* Footer */}
{/* Footer */}
      <footer className="py-8 bg-deep-black border-t border-gold">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-silver font-inter mb-4">
            © 2025 DataToyAI. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://discord.com" className="text-gold hover:underline font-inter">Join Our Community</a>
            <a href="https://docs.datatoyai.com" className="text-gold hover:underline font-inter">Documentation</a>
            <a href="mailto:info@datatoyai.com" className="text-gold hover:underline font-inter">Contact Us</a>
          </div>
          <p className="text-silver font-inter">
            Follow us on{' '}
            <a href="https://twitter.com/datatoyai" className="text-gold hover:underline">Twitter</a> |{' '}
            <a href="https://linkedin.com/company/datatoyai" className="text-gold hover:underline">LinkedIn</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;