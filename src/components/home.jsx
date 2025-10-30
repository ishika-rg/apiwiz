import { useState, useCallback } from 'react';
import {
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import JSONInput from './JSONInput';
import SearchBar from './SearchBar';
import TreeVisualization from './TreeVisualization';
import { jsonToNodes, layoutNodes, findNodeByPath, highlightNode } from '../utils/jsonTreeUtils';
import { SAMPLE_JSON } from '../constants/sampleData';
import './home.css';

const JSONTreeVisualizer = () => {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [error, setError] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchPath, setSearchPath] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const reactFlowInstance = useReactFlow();

  // Visualize JSON
  const handleVisualize = useCallback(() => {
    try {
      setError('');
      setSearchMessage('');
      const parsed = JSON.parse(jsonInput);
      const { nodes: newNodes, edges: newEdges } = jsonToNodes(parsed, null, 'root', '$', 0, isDarkMode);
      const layoutedNodes = layoutNodes(newNodes, newEdges);
      setNodes(layoutedNodes);
      setEdges(newEdges);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setNodes([]);
      setEdges([]);
    }
  }, [jsonInput, isDarkMode, setNodes, setEdges]);

  // Search functionality
  const handleSearch = useCallback(() => {
    if (!searchPath.trim()) {
      setSearchMessage('Please enter a search path');
      return;
    }

    const matchingNode = findNodeByPath(nodes, searchPath);

    if (matchingNode) {
      setSearchMessage(`Match found: ${matchingNode.data.path}`);

      const updatedNodes = highlightNode(nodes, matchingNode.id);
      setNodes(updatedNodes);

      
      if (reactFlowInstance && matchingNode.position) {
        reactFlowInstance.setCenter(
          matchingNode.position.x + 60, 
          matchingNode.position.y + 20, 
          { zoom: 1, duration: 800 }
        );
      }
    } else {
      setSearchMessage('No match found');
      const resetNodes = nodes.map(node => ({
        ...node,
        style: {
          ...node.style,
          boxShadow: 'none',
          transform: 'scale(1)'
        }
      }));
      setNodes(resetNodes);
    }
  }, [searchPath, nodes, setNodes, reactFlowInstance]);

  // Clear functionality
  const handleClear = useCallback(() => {
    setJsonInput('');
    setNodes([]);
    setEdges([]);
    setError('');
    setSearchPath('');
    setSearchMessage('');
  }, [setNodes, setEdges]);

  // Reset to sample
  const handleReset = useCallback(() => {
    setJsonInput(JSON.stringify(SAMPLE_JSON, null, 2));
    setError('');
    setSearchPath('');
    setSearchMessage('');
  }, []);

  // Copy node path on click
  const onNodeClick = useCallback((event, node) => {
    const path = node.data.path;
    navigator.clipboard.writeText(path);
    setSearchMessage(`Copied path: ${path}`);
    setTimeout(() => setSearchMessage(''), 2000);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`visualizer-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>JSON Tree Visualizer</h1>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="controls-panel">
        <JSONInput
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          error={error}
          onVisualize={handleVisualize}
          onClear={handleClear}
          onReset={handleReset}
        />

        <SearchBar
          searchPath={searchPath}
          setSearchPath={setSearchPath}
          searchMessage={searchMessage}
          onSearch={handleSearch}
        />
      </div>

      <TreeVisualization
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

const Home = () => {
  return (
    <ReactFlowProvider>
      <JSONTreeVisualizer />
    </ReactFlowProvider>
  );
};

export default Home;
