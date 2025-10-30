import PropTypes from 'prop-types';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const TreeVisualization = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  isDarkMode
}) => {
  return (
    <div className="tree-container">
      <div className="tree-info">
        Click on any node to copy its path | Drag to pan | Use controls to zoom
      </div>
      {nodes.length > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
        >
          <Background color={isDarkMode ? '#444' : '#aaa'} gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.style?.background) return node.style.background;
              return '#667eea';
            }}
            maskColor={isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)'}
          />
        </ReactFlow>
      ) : (
        <div className="empty-state">
          <p>Enter JSON and click "Generate Tree" to visualize</p>
        </div>
      )}
    </div>
  );
};

TreeVisualization.propTypes = {
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  onNodesChange: PropTypes.func.isRequired,
  onEdgesChange: PropTypes.func.isRequired,
  onNodeClick: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default TreeVisualization;
