import React, { useState, useEffect, useRef } from 'react';
import { fileSystem } from './data/filesystem'; // Make sure this file exists
import './styles/index.css';

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { command: '', output: 'Welcome to Terminal Portfolio. Type "help" to begin.' }
  ]);
  
  // For navigating previous commands with Up/Down arrows
  const [cmdHistory, setCmdHistory] = useState([]);
  const [pointer, setPointer] = useState(-1);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // 1. Auto-scroll to bottom whenever history updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // 2. Keep focus on input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e) => {
    // Handle Command History (Up Arrow)
    if (e.key === 'ArrowUp') {
      if (pointer < cmdHistory.length - 1) {
        const newPointer = pointer + 1;
        setPointer(newPointer);
        setInput(cmdHistory[cmdHistory.length - 1 - newPointer]);
      }
    }

    // Handle Command History (Down Arrow)
    if (e.key === 'ArrowDown') {
      if (pointer > 0) {
        const newPointer = pointer - 1;
        setPointer(newPointer);
        setInput(cmdHistory[cmdHistory.length - 1 - newPointer]);
      } else {
        setPointer(-1);
        setInput('');
      }
    }

    // Handle Execution
    if (e.key === 'Enter') {
      const cleanInput = input.toLowerCase().trim();
      if (!cleanInput) return;

      let response = '';

      switch (cleanInput) {
        case 'help':
          response = 'Available commands: about, skills, projects, clear, github';
          break;
        case 'about':
          response = fileSystem["about.txt"];
          break;
        case 'skills':
          response = fileSystem["skills.txt"];
          break;
        case 'projects':
          response = "Projects found: " + Object.keys(fileSystem.projects).join(', ');
          break;
        case 'github':
          response = "Opening GitHub...";
          window.open("https://github.com/Binaya764", "_blank");
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          setPointer(-1);
          return;
        default:
          response = `bash: command not found: ${cleanInput}`;
      }

      setHistory(prev => [...prev, { command: input, output: response }]);
      setCmdHistory(prev => [...prev, input]);
      setInput('');
      setPointer(-1);
    }
  };

  return (
    <div className="terminal-container" onClick={() => inputRef.current.focus()}>
      <div className="history">
        {history.map((entry, index) => (
          <div key={index} className="history-item">
            {entry.command && (
              <div className="prompt-line">
                <span className="user">guest@portfolio</span>:<span className="path">~</span>$ {entry.command}
              </div>
            )}
            <div className="output">{entry.output}</div>
          </div>
        ))}
        {/* Dummy div to anchor the scroll */}
        <div ref={bottomRef} />
      </div>

      <div className="input-line">
        <span className="user">guest@portfolio</span>:<span className="path">~</span>$ 
        <input 
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          spellCheck="false"
          autoComplete="off"
        />
      </div>
    </div>
  );
}

export default App;