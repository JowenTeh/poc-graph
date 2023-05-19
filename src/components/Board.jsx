import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';
import Graph from "graphology";
import { bfsFromNode } from 'graphology-traversal';
import Sigma from "sigma";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { animateNodes } from "sigma/utils/animate";
import tinycolor from "tinycolor2";
import graphData from '../data/graph';

const Board = forwardRef(function Board(props, ref) {
  const {
    setNode,
    setIsDragging,
    onRefGraphChange,
    onGraphChange,
  } = props;

  const refGraph = useRef(Graph.from(graphData));
  const graph = useRef(new Graph());

  let { node } = props;
  let neighbourNodes = new Set();
  let isDragging = false;

  const addNode = (graph, key, attributes) => {
    const x = 1;
    const y = 1;
    const size = 40;
    let color;
    let type;
    let image;

    graph.mergeNode(key, {
      x,
      y,
      size,
      color,
      type,
      image,
      ...attributes,
      renderedAt: Date.now(),
    });
  };

  const addEdge = (graph, { source, target }, attributes) => {
    const type = 'arrow';
    const size = 8;

    graph.mergeEdge(source, target, {
      type,
      size,
      ...attributes,
    });
  };

  const expandByLevel = (fromNode, level = 1) => {
    const nodes = [];
    bfsFromNode(refGraph.current, fromNode, (n, attr, depth) => {
      if (depth > level) {
        return true;
      }

      const edges = refGraph.current.edges(n);

      if (!graph.current.hasNode(n)) {
        const x = graph.current.getNodeAttribute(fromNode, 'x');
        const y = graph.current.getNodeAttribute(fromNode, 'y');
        addNode(graph.current, n, { ...refGraph.current.getNodeAttributes(n), x, y });
        nodes.push(n);
      }
      edges.forEach((e) => {
        const source = refGraph.current.source(e);
        const target = refGraph.current.target(e);

        if (graph.current.hasNode(source) && graph.current.hasNode(target)) {
          addEdge(graph.current, { source, target }, refGraph.current.getEdgeAttributes(e));
        }
      });
    }, { mode: 'directed' });

    const positions = nodes.reduce((acc, node) => {
      const { x: refX, y: refY} = refGraph.current.getNodeAttributes(node);
      return Object.assign(acc, {
        [node]: {
          x: refX,
          y: refY,
        },
      });
    }, {});
    animateNodes(graph.current, positions, { duration: 200, easing: "linear" });

    return nodes;
  };

  const expandByNodes = (nodes = []) => {
    const positions = {};
    nodes.forEach((node) => {
      if (refGraph.current.hasNode(node) && !graph.current.hasNode(node)) {
        const x = 0;
        const y = 0;
   
        const attributes = refGraph.current.getNodeAttributes(node);
        addNode(graph.current, node, { ...attributes, x, y });
        Object.assign(positions, { [node]: { x: attributes.x, y: attributes.y } });
   
        const edges = refGraph.current.edges(node);
   
        edges.forEach((edge) => {
          const source = refGraph.current.source(edge);
          const target = refGraph.current.target(edge);

          if (graph.current.hasNode(source) && graph.current.hasNode(target)) {
            addEdge(graph.current, { source, target }, refGraph.current.getEdgeAttributes(edge));
          }
        });
      }
    });

    animateNodes(graph.current, positions, { duration: 200, easing: "linear" });

    return nodes;
  }

  const changeQuery = (query) => {
    if (!query) {
      graph.current.clear();
    } else {
      const nodes = refGraph.current.filterNodes((node, attributes) => {
        const q = query.toLowerCase();
        return (
          q.includes(attributes.label?.toLowerCase())
          || q.includes(attributes.firstName?.toLowerCase())
          || q.includes(attributes.lastName?.toLowerCase())
          || attributes.label?.toLowerCase().includes(q)
        );
      });

      expandByNodes(nodes);
    }
  }

  useImperativeHandle(ref, () => ({
    expandByLevel,
    expandByNodes,
    changeQuery,
  }));

  useEffect(() => {
    if (onRefGraphChange) {
      onRefGraphChange(refGraph.current);
    }

    if (onGraphChange) {
      onGraphChange(graph.current);
    }
  }, []);

  useEffect(() => {
    const container = document.getElementById('sigma-container');

    const renderer = new Sigma(graph.current, container, {
      nodeProgramClasses: {
        image: getNodeProgramImage(),
      },
      renderEdgeLabels: true,
      defaultEdgeType: 'arrow',
      labelSize: 12,
      edgeLabelSize: 8,
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
    });

    renderer.on("downNode", (e) => {
      node = e.node;
      setNode(node);

      neighbourNodes = new Set(graph.current.neighbors(e.node))

      if (graph.current.size > 1) {
        isDragging = true;
        setIsDragging(isDragging);
      }

      renderer.refresh();
    });

    renderer.on("clickStage", () => {
      node = null;
      setNode(node);

      neighbourNodes = new Set();

      renderer.refresh();
    });

    // #region Node reducer
    // Render nodes accordingly to the internal state:
    // 1. If a node is selected, it is highlighted
    // 2. If there is query, all non-matching nodes are greyed
    renderer.setSetting("nodeReducer", (currentNode, data) => {
      const res = { ...data };

      if (node && neighbourNodes && !neighbourNodes.has(currentNode) && node !== currentNode) {
        res.label = "";
        res.color = tinycolor(res.color)
          .desaturate(80)
          .lighten(15)
          .toRgbString();
      }

      if (node === currentNode) {
        res.highlighted = true;
      } else {
        res.highlighted = false;
      }

      return res;
    });
    // #endregion

    // #region Add drag'n'drop feature
    // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
    renderer.getMouseCaptor().on("mousemovebody", (e) => {
      if (!isDragging || !node) {
        return;
      }

      // Get new position of node
      const pos = renderer.viewportToGraph(e);

      graph.current.setNodeAttribute(node, "x", pos.x);
      graph.current.setNodeAttribute(node, "y", pos.y);

      // Prevent sigma to move camera:
      e.preventSigmaDefault();
      e.original.preventDefault();
      e.original.stopPropagation();
    });

    // On mouse up, we reset the autoscale and the dragging mode
    renderer.getMouseCaptor().on("mouseup", () => {
      if (node) {
        graph.current.removeNodeAttribute(node, "highlighted");
      }
      isDragging = false;
      setIsDragging(isDragging);
    });

    // Disable the autoscale at the first down interaction
    renderer.getMouseCaptor().on("mousedown", () => {
      if (isDragging && !renderer.getCustomBBox()) {
        renderer.setCustomBBox(renderer.getBBox());
      }
    });
    // #endregion

    renderer.on("doubleClickNode", (e) => {
      node = e.node;
      setNode(node);

      isDragging = false;
      setIsDragging(isDragging);

      const refGraphNeighbors = refGraph.current.neighbors(node);
      const graphNeighbors = graph.current.neighbors(e.node);
      const x = graph.current.getNodeAttribute(e.node, 'x');
      const y = graph.current.getNodeAttribute(e.node, 'y');

      if (graphNeighbors.length !== refGraphNeighbors.length) {
        // Expand
        expandByLevel(e.node, 1);
      } else {
        // Collapse
        const positions = {};

        const findDescendants = (node, descendants = []) => {
          graph.current.neighbors(node).forEach((n) => {
            if (graph.current.getNodeAttribute(n, 'renderedAt') > graph.current.getNodeAttribute(e.node, 'renderedAt') && !descendants.includes(n)) {
              descendants.push(n);
              findDescendants(n, descendants);
            }
          });
          return descendants;
        };
        findDescendants(e.node).forEach((n) => {
          positions[n] = { x, y };
        });

        animateNodes(graph.current, positions, { duration: 200, easing: "linear" }, () => {
          Object.keys(positions).forEach((n) => {
            graph.current.dropNode(n);
          });
        });
      }

      neighbourNodes = new Set(graph.current.neighbors(e.node))

      // Prevent sigma to move camera:
      e.preventSigmaDefault();
      e.original?.preventDefault();
      e.original?.stopPropagation();
      e.event.original?.preventDefault();
      e.event.original?.stopPropagation();

      renderer.refresh();
    });

    return () => {
      renderer.kill();
    };
  }, []);

  return (
    <div className={`w-full h-full bg-slate-100 select-none	${props.className ?? ''}`}>
      <div id="sigma-container" className="w-full h-full"></div>
    </div>
  )
});

export default memo(Board);
