import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiRotateCcw, FiCode } from 'react-icons/fi';
import { getAlgorithmById, getAllAlgorithms } from '../data/algorithms';
import './Visualizer.css';

export default function Visualizer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const algoId = searchParams.get('algo') || 'bubble-sort';
  
  const [algorithm, setAlgorithm] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // 1=slow, 2=medium, 3=fast
  const [tutorialMode, setTutorialMode] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [input, setInput] = useState('');
  const [executionData, setExecutionData] = useState(null);
  const [mermaidKey, setMermaidKey] = useState(0);
  
  const mermaidRef = useRef(null);
  const playIntervalRef = useRef(null);
  const editorRef = useRef(null);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#4f46e5',
        primaryTextColor: '#fff',
        primaryBorderColor: '#6366f1',
        lineColor: '#818cf8',
        secondaryColor: '#1e1b4b',
        tertiaryColor: '#312e81'
      }
    });
  }, []);

  // Load algorithm when algoId changes
  useEffect(() => {
    const algo = getAlgorithmById(algoId);
    if (algo) {
      setAlgorithm(algo);
      setInput(getDefaultInput(algo));
      setCurrentStep(0);
      setIsPlaying(false);
      setHighlightedLine(null);
      setExecutionData(null);
      setMermaidKey(prev => prev + 1);
    }
  }, [algoId]);

  // Render Mermaid diagram
  useEffect(() => {
    if (algorithm && mermaidRef.current) {
      const renderMermaid = async () => {
        try {
          const id = `mermaid-${mermaidKey}`;
          const { svg } = await mermaid.render(id, algorithm.mermaidFlowchart);
          mermaidRef.current.innerHTML = svg;
          
          // Add zoom and pan capabilities
          const svgElement = mermaidRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.maxHeight = '100%';
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      };
      renderMermaid();
    }
  }, [algorithm, mermaidKey]);

  // Playback control
  useEffect(() => {
    const hasSteps = algorithm?.executionSteps && algorithm.executionSteps.length > 0;
    if (isPlaying && algorithm && hasSteps) {
      const stepDelay = speed === 1 ? 2000 : speed === 2 ? 1000 : 500;
      
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= algorithm.executionSteps.length) {
            setIsPlaying(false);
            return prev;
          }
          
          // Highlight corresponding code line
          const step = algorithm.executionSteps[nextStep];
          if (step && step.line) {
            setHighlightedLine(step.line);
          }
          
          return nextStep;
        });
      }, stepDelay);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, speed, algorithm]);

  const getDefaultInput = (algo) => {
    if (algo.category === 'sorting') {
      return '[64, 34, 25, 12, 22, 11, 90]';
    } else if (algo.category === 'searching') {
      return '23';
    } else if (algo.category === 'graph') {
      return JSON.stringify({
        'A': ['B', 'C'],
        'B': ['D', 'E'],
        'C': ['F'],
        'D': [],
        'E': ['F'],
        'F': []
      }, null, 2);
    }
    return '';
  };

  const handlePlay = () => {
    if (!algorithm || !hasExecutionSteps) return;
    
    if (currentStep >= algorithm.executionSteps.length - 1) {
      // Restart if at end
      setCurrentStep(0);
      setHighlightedLine(null);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (!algorithm || !hasExecutionSteps) return;
    if (currentStep < algorithm.executionSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const step = algorithm.executionSteps[nextStep];
      if (step && step.line) {
        setHighlightedLine(step.line);
      }
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const step = algorithm.executionSteps[prevStep];
      if (step && step.line) {
        setHighlightedLine(step.line);
      } else {
        setHighlightedLine(null);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setHighlightedLine(null);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure Monaco for Python
    monaco.languages.setMonarchTokensProvider('python', {
      tokenizer: {
        root: [
          [/def|if|else|elif|for|while|return|class|import|from|try|except|finally|with|as|pass|break|continue/, 'keyword'],
          [/True|False|None/, 'constant'],
          [/[0-9]+/, 'number'],
          [/["'].*?["']/, 'string'],
          [/#.*/, 'comment'],
        ]
      }
    });
  };

  const getCurrentStepInfo = () => {
    if (!algorithm || !algorithm.executionSteps || algorithm.executionSteps.length === 0) {
      return null;
    }
    if (currentStep >= algorithm.executionSteps.length) {
      return null;
    }
    return algorithm.executionSteps[currentStep];
  };

  const hasExecutionSteps = algorithm?.executionSteps && algorithm.executionSteps.length > 0;

  // Generate program output based on current execution step
  const generateProgramOutput = () => {
    if (!algorithm) return <div className="output-placeholder">Output will appear here when you run the program</div>;
    
    const outputLines = [];
    
    // Generate output based on algorithm type and current step
    if (algorithm.id === 'bubble-sort') {
      const initialArray = [64, 34, 25, 12, 22, 11, 90];
      let currentArray = [...initialArray];
      
      // Simulate bubble sort execution
      for (let step = 0; step <= Math.min(currentStep, algorithm.executionSteps.length - 1); step++) {
        const stepInfo = algorithm.executionSteps[step];
        if (!stepInfo) continue;
        
        if (stepInfo.action.includes('Swap')) {
          // Extract array state from message
          const match = stepInfo.message.match(/\[(.*?)\]/);
          if (match) {
            currentArray = match[1].split(', ').map(Number);
          }
        }
        
        if (step === currentStep) {
          outputLines.push(
            <div key={step} className="output-line active">
              <span className="output-label">Step {step + 1}:</span>
              <span className="output-message">{stepInfo.message}</span>
            </div>
          );
        } else {
          outputLines.push(
            <div key={step} className="output-line">
              <span className="output-label">Step {step + 1}:</span>
              <span className="output-message">{stepInfo.message}</span>
            </div>
          );
        }
      }
      
      // Always show final result at the end
      if (currentStep >= algorithm.executionSteps.length - 1) {
        outputLines.push(
          <div key="final" className="output-line output-result">
            <span className="output-label">Final Answer:</span>
            <span className="output-message">Sorted array: [11, 12, 22, 25, 34, 64, 90]</span>
          </div>
        );
        outputLines.push(
          <div key="print" className="output-line output-result">
            <span className="output-label">Program Output:</span>
            <span className="output-message">Sorted array: [11, 12, 22, 25, 34, 64, 90]</span>
          </div>
        );
      } else {
        // Show placeholder for final answer
        outputLines.push(
          <div key="placeholder" className="output-line output-placeholder-line">
            <span className="output-message">Run the program to see the final answer...</span>
          </div>
        );
      }
      
      if (outputLines.length === 0) {
        outputLines.push(
          <div className="output-line">
            <span className="output-message">Initial array: [64, 34, 25, 12, 22, 11, 90]</span>
          </div>
        );
      }
    } else {
      // Generic output for other algorithms
      if (hasExecutionSteps && currentStep < algorithm.executionSteps.length) {
        const stepInfo = algorithm.executionSteps[currentStep];
        outputLines.push(
          <div className="output-line active">
            <span className="output-label">Current Step:</span>
            <span className="output-message">{stepInfo.message}</span>
          </div>
        );
      }
      
      // Extract example output from code comments or generate default
      const codeLines = algorithm.pythonCode.split('\n');
      const printLines = codeLines.filter(line => line.includes('print('));
      
      // Show final answer if execution is complete
      if (hasExecutionSteps && currentStep >= algorithm.executionSteps.length - 1) {
        printLines.forEach((line, idx) => {
          const match = line.match(/print\([^)]+\)/);
          if (match) {
            // Extract the actual output
            let outputText = match[0];
            // Try to extract f-string values
            if (outputText.includes('f"') || outputText.includes("f'")) {
              // For Bubble Sort, show the sorted array
              if (algorithm.id === 'bubble-sort') {
                outputText = 'Sorted array: [11, 12, 22, 25, 34, 64, 90]';
              }
            }
            outputLines.push(
              <div key={`final-answer-${idx}`} className="output-line output-result">
                <span className="output-label">Final Answer:</span>
                <span className="output-message">{outputText.replace(/print\(|\)|f?"|'/g, '').trim()}</span>
              </div>
            );
          }
        });
      }
      
      if (outputLines.length === 0) {
        outputLines.push(
          <div className="output-placeholder">Run the program to see output</div>
        );
      }
    }
    
    return outputLines.length > 0 ? outputLines : (
      <div className="output-placeholder">Output will appear here when you run the program</div>
    );
  };

  const currentStepInfo = getCurrentStepInfo();

  if (!algorithm) {
    return (
      <div className="visualizer-loading">
        <p>Loading algorithm...</p>
      </div>
    );
  }

  return (
    <div className="visualizer-container">
      {/* Control Panel */}
      <div className="visualizer-controls">
        <div className="controls-left">
          <h2 className="visualizer-title">{algorithm.name}</h2>
          <span className="algorithm-category">{algorithm.category}</span>
        </div>
        
        <div className="controls-center">
          <button 
            className="control-btn" 
            onClick={handleReset}
            title="Reset"
          >
            <FiRotateCcw />
          </button>
          <button 
            className="control-btn" 
            onClick={handleStepBackward}
            disabled={currentStep === 0}
            title="Step Backward"
          >
            <FiSkipBack />
          </button>
          {isPlaying ? (
            <button 
              className="control-btn play-btn" 
              onClick={handlePause}
              title="Pause"
            >
              <FiPause />
            </button>
          ) : (
            <button 
              className="control-btn play-btn" 
              onClick={handlePlay}
              title="Play"
            >
              <FiPlay />
            </button>
          )}
          <button 
            className="control-btn" 
            onClick={handleStepForward}
            disabled={!hasExecutionSteps || currentStep >= algorithm.executionSteps.length - 1}
            title="Step Forward"
          >
            <FiSkipForward />
          </button>
        </div>

        <div className="controls-right">
          <div className="speed-control">
            <label>Speed:</label>
            <input 
              type="range" 
              min="1" 
              max="3" 
              value={speed} 
              onChange={handleSpeedChange}
              className="speed-slider"
            />
            <span className="speed-label">
              {speed === 1 ? 'Slow' : speed === 2 ? 'Medium' : 'Fast'}
            </span>
          </div>
          <button 
            className={`control-btn ${tutorialMode ? 'active' : ''}`}
            onClick={() => setTutorialMode(!tutorialMode)}
            title="Tutorial Mode"
          >
            <FiCode /> Tutorial
          </button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <PanelGroup direction="horizontal" className="split-panel-group">
        {/* Left Panel - Flowchart */}
        <Panel defaultSize={50} minSize={30} className="flowchart-panel">
          <div className="flowchart-wrapper">
            <div 
              ref={mermaidRef} 
              className="mermaid-container"
              key={mermaidKey}
            />
          </div>
        </Panel>

        <PanelResizeHandle className="resize-handle" />

        {/* Right Panel - Code Editor */}
        <Panel defaultSize={50} minSize={30} className="code-panel">
          <div className="code-container">
            <div className="editor-wrapper">
              <Editor
                height="100%"
                language="python"
                value={algorithm.pythonCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  folding: true,
                  scrollBeyondLastLine: true,
                  renderLineHighlight: 'all',
                  highlightActiveIndentGuide: true,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
                onMount={handleEditorDidMount}
              />
              {highlightedLine && (
                <div className="code-highlight-overlay" style={{
                  top: `${(highlightedLine - 1) * 19}px`,
                  height: '19px'
                }} />
              )}
            </div>
            
            {/* Program Output Section */}
            <div className="output-section">
              <div className="output-header">
                <h4>Program Output</h4>
              </div>
              <div className="output-content">
                {generateProgramOutput()}
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>

    </div>
  );
}
