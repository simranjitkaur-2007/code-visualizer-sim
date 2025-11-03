import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { algorithms, getAllAlgorithms } from '../data/algorithms';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleAlgoClick = (algoId) => {
    navigate(`/visualizer?algo=${algoId}`);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const categoryLabels = {
    sorting: 'Sorting Algorithms',
    searching: 'Searching Algorithms',
    graph: 'Graph Algorithms'
  };

  const categoryIcons = {
    sorting: '🔀',
    searching: '🔍',
    graph: '🕸️'
  };

  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="blob blob-left" />
        <div className="blob blob-right" />
        <span className="beta-badge">
          🚀 Free Beta Access
        </span>

        <h1 className="hero-title">
          Learn <span className="accent">Algorithms</span> Visually
        </h1>

        <p className="hero-subtitle">
          Interactive algorithm visualization with split-screen flowcharts and Python code. 
          Watch algorithms execute step-by-step with synchronized highlighting.
        </p>

        <button 
          onClick={() => navigate('/visualizer?algo=bubble-sort')}
          className="hero-cta"
        >
          Start Visualizing
        </button>

        <div className="hero-illustration">
          <img src="project.2.webp" alt="Algorithm Visualization" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Flowchart Visualization</h3>
            <p>Interactive Mermaid.js flowcharts on the left panel show algorithm structure and flow.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Python Code</h3>
            <p>Monaco Editor with syntax highlighting displays the actual implementation on the right.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Step-by-Step</h3>
            <p>Play, pause, and step through algorithm execution with synchronized highlighting.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Tutorial Mode</h3>
            <p>Educational explanations for each step help you understand the algorithm logic.</p>
          </div>
        </div>
      </section>

      {/* Algorithm Categories Section */}
      <section className="algorithms-section">
        <h2 className="section-title">Browse Algorithms</h2>
        <p className="section-subtitle">
          Select an algorithm to see its flowchart and Python implementation
        </p>

        <div className="algorithm-categories">
          {Object.entries(algorithms).map(([category, algoList]) => (
            <div key={category} className="algorithm-category">
              <button 
                className="category-header"
                onClick={() => toggleCategory(category)}
              >
                <span className="category-icon">{categoryIcons[category]}</span>
                <h3 className="category-title">{categoryLabels[category]}</h3>
                <span className="category-count">{algoList.length} algorithms</span>
                {expandedCategories[category] ? (
                  <FiChevronDown className="chevron" />
                ) : (
                  <FiChevronRight className="chevron" />
                )}
              </button>

              {expandedCategories[category] && (
                <div className="algorithm-list">
                  {algoList.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => handleAlgoClick(algo.id)}
                      className="algorithm-item"
                    >
                      <div className="algorithm-item-header">
                        <span className="algorithm-name">{algo.name}</span>
                        <span className="algorithm-complexity">
                          {algo.complexity.time}
                        </span>
                      </div>
                      <p className="algorithm-description">{algo.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Access - All Algorithms */}
        <div className="quick-access">
          <h3 className="quick-access-title">Quick Access</h3>
          <div className="popular-list">
            {getAllAlgorithms().slice(0, 8).map((algo) => (
              <button
                key={algo.id}
                onClick={() => handleAlgoClick(algo.id)}
                className="popular-item"
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
