import { MarkerType } from '@xyflow/react';

// Node type styling configuration
export const nodeStyles = {
  object: {
    style: {
      background: '#637cecff',
      color: 'white',
      border: '2px solid #5a67d8',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '120px'
    }
  },
  array: {
    style: {
      background: '#4ec07eff',
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

  // Find root node 
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


export const findNodeByPath = (nodes, searchPath) => {
  if (!searchPath.trim()) {
    return null;
  }

  return nodes.find(node => {
    const nodePath = node.data.path;
    
    return nodePath === searchPath || nodePath.includes(searchPath);
  });
};


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
