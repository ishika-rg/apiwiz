import { MarkerType } from '@xyflow/react';

// Node type styling configuration
export const nodeStyles = {
  object: {
    style: {
      background: '#667eea',
      color: 'white',
      border: '2px solid #5a67d8',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '120px'
    }
  },
  array: {
    style: {
      background: '#48bb78',
      color: 'white',
      border: '2px solid #38a169',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '120px'
    }
  },
  primitive: {
    style: {
      background: '#ed8936',
      color: 'white',
      border: '2px solid #dd6b20',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '120px'
    }
  }
};

/**
 * Convert JSON object to React Flow nodes and edges
 * @param {*} obj - The JSON object to convert
 * @param {string|null} parentId - Parent node ID
 * @param {string} key - Current key name
 * @param {string} path - JSON path (e.g., $.user.name)
 * @param {number} level - Tree depth level
 * @param {boolean} isDarkMode - Dark mode flag for edge styling
 * @returns {{nodes: Array, edges: Array}}
 */
export const jsonToNodes = (obj, parentId = null, key = 'root', path = '$', level = 0, isDarkMode = false) => {
  const nodes = [];
  const edges = [];
  const nodeId = `${parentId || 'root'}-${key}-${level}`;

  const baseNode = {
    id: nodeId,
    position: { x: 0, y: 0 },
    data: {
      label: '',
      path: path,
      value: obj
    },
  };

  if (obj === null || obj === undefined) {
    // Null/undefined node
    nodes.push({
      ...baseNode,
      type: 'default',
      data: {
        ...baseNode.data,
        label: `${key}: null`
      },
      style: nodeStyles.primitive.style
    });
  } else if (Array.isArray(obj)) {
    // Array node
    nodes.push({
      ...baseNode,
      type: 'default',
      data: {
        ...baseNode.data,
        label: `${key} []`
      },
      style: nodeStyles.array.style
    });

    obj.forEach((item, index) => {
      const childPath = `${path}[${index}]`;
      const { nodes: childNodes, edges: childEdges } = jsonToNodes(
        item,
        nodeId,
        `[${index}]`,
        childPath,
        level + 1,
        isDarkMode
      );
      nodes.push(...childNodes);
      edges.push(...childEdges);
      edges.push({
        id: `${nodeId}-${childNodes[0].id}`,
        source: nodeId,
        target: childNodes[0].id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: isDarkMode ? '#666' : '#b1b1b7' }
      });
    });
  } else if (typeof obj === 'object') {
    // Object node
    nodes.push({
      ...baseNode,
      type: 'default',
      data: {
        ...baseNode.data,
        label: `${key} {}`
      },
      style: nodeStyles.object.style
    });

    Object.entries(obj).forEach(([childKey, value]) => {
      const childPath = path === '$' ? `$.${childKey}` : `${path}.${childKey}`;
      const { nodes: childNodes, edges: childEdges } = jsonToNodes(
        value,
        nodeId,
        childKey,
        childPath,
        level + 1,
        isDarkMode
      );
      nodes.push(...childNodes);
      edges.push(...childEdges);
      edges.push({
        id: `${nodeId}-${childNodes[0].id}`,
        source: nodeId,
        target: childNodes[0].id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: isDarkMode ? '#666' : '#b1b1b7' }
      });
    });
  } else {
    // Primitive node (string, number, boolean)
    const displayValue = typeof obj === 'string' ? `"${obj}"` : String(obj);
    nodes.push({
      ...baseNode,
      type: 'default',
      data: {
        ...baseNode.data,
        label: `${key}: ${displayValue}`
      },
      style: nodeStyles.primitive.style
    });
  }

  return { nodes, edges };
};

/**
 * Layout nodes in a hierarchical tree structure
 * @param {Array} nodes - Array of nodes to layout
 * @param {Array} edges - Array of edges
 * @returns {Array} - Nodes with updated positions
 */
export const layoutNodes = (nodes, edges) => {
  const levelMap = new Map();
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const childrenMap = new Map();

  // Build children map
  edges.forEach(edge => {
    if (!childrenMap.has(edge.source)) {
      childrenMap.set(edge.source, []);
    }
    childrenMap.get(edge.source).push(edge.target);
  });

  // Calculate levels using BFS
  const calculateLevels = (nodeId, level = 0) => {
    if (!levelMap.has(level)) {
      levelMap.set(level, []);
    }
    levelMap.get(level).push(nodeId);

    const children = childrenMap.get(nodeId) || [];
    children.forEach(childId => calculateLevels(childId, level + 1));
  };

  // Find root node (node with no incoming edges)
  const targetNodes = new Set(edges.map(e => e.target));
  const rootNode = nodes.find(n => !targetNodes.has(n.id));

  if (rootNode) {
    calculateLevels(rootNode.id);
  }

  // Position nodes
  const horizontalSpacing = 200;
  const verticalSpacing = 100;

  levelMap.forEach((nodeIds, level) => {
    const levelWidth = nodeIds.length * horizontalSpacing;
    const startX = -levelWidth / 2;

    nodeIds.forEach((nodeId, index) => {
      const node = nodeMap.get(nodeId);
      if (node) {
        node.position = {
          x: startX + index * horizontalSpacing,
          y: level * verticalSpacing
        };
      }
    });
  });

  return nodes;
};

/**
 * Search for a node by JSON path
 * @param {Array} nodes - Array of nodes to search
 * @param {string} searchPath - JSON path to search for
 * @returns {Object|null} - Matching node or null
 */
export const findNodeByPath = (nodes, searchPath) => {
  if (!searchPath.trim()) {
    return null;
  }

  return nodes.find(node => {
    const nodePath = node.data.path;
    // Support both exact match and partial match
    return nodePath === searchPath || nodePath.includes(searchPath);
  });
};

/**
 * Highlight a specific node
 * @param {Array} nodes - Array of nodes
 * @param {string} nodeId - ID of node to highlight
 * @returns {Array} - Updated nodes array
 */
export const highlightNode = (nodes, nodeId) => {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return {
        ...node,
        style: {
          ...node.style,
          boxShadow: '0 0 20px 5px #ffd700',
          transform: 'scale(1.1)'
        }
      };
    }
    return {
      ...node,
      style: {
        ...node.style,
        boxShadow: 'none',
        transform: 'scale(1)'
      }
    };
  });
};
