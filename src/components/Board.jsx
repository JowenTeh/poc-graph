import { memo, useEffect, useState } from 'react';
import Graph from "graphology";
import { connectedComponents } from 'graphology-components';
import { allSimplePaths } from 'graphology-simple-path';
import random from 'graphology-layout/random';
import circular from 'graphology-layout/circular';
import noverlap from 'graphology-layout-noverlap';
import forceLayout from 'graphology-layout-force';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2Layout from 'graphology-layout-forceatlas2/worker';
import { bfsFromNode } from 'graphology-traversal';
import Sigma from "sigma";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { animateNodes } from "sigma/utils/animate";
import tinycolor from "tinycolor2";
import citySvg from '../assets/city.svg';
import userSvg from '../assets/user.svg';

const Board = function Board(props) {
  const {
    children,
    graph,
    refGraph,
    // node,
    setNode,
    // neighbourNodes,
    setNeighbourNodes,
    // isDragging,
    setIsDragging,
    query,
    selectedSuggestions,
  } = props;

  let node = null;
  let neighbourNodes = new Set();
  let isDragging = false;

  useEffect(() => {
    const container = document.getElementById('sigma-container');
    // const graph = new Graph();
    let hasNewNode = false;

    const addNode = (graph, key, attributes) => {
      const x = 1;
      const y = 1;
      const size = 40;
      let color;
      let type;
      let image;

      if (attributes.category === 'person') {
        color = 'purple';
        type = 'image';
        image = userSvg;
      } else if (attributes.category === 'infringement') {
        color = 'orange';
        type = 'circle';
      } else if (attributes.category === 'location') {
        color = 'green';
        type = 'circle';
      }

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

    const permutation = (xs) => {
      let ret = [];
    
      for (let i = 0; i < xs.length; i = i + 1) {
        let rest = permutation(xs.slice(0, i).concat(xs.slice(i + 1)));
    
        if(!rest.length) {
          ret.push([xs[i]])
        } else {
          for(let j = 0; j < rest.length; j = j + 1) {
            ret.push([xs[i]].concat(rest[j]))
          }
        }
      }
      return ret;
    };

    // const refGraph = Graph.from({
    //   options: {
    //     type: 'mixed',
    //     multi: false,
    //     allowSelfLoops: true,
    //   },
    //   attributes: {},
    //   nodes: [
    //     { key: 'p-001', attributes: { category: 'person', label: 'Lia Caniago, Robiah' } },
    //     { key: 'p-002', attributes: { category: 'person', label: 'Silva, Widodo' } },
    //     { key: 'p-003', attributes: { category: 'person', label: 'Tirta, Susilo' } },
    //     { key: 'p-004', attributes: { category: 'person', label: 'Freddy, Santoso' } },
    //     { key: 'p-005', attributes: { category: 'person', label: 'Martha, Halihi' } },
    //     { key: 'p-006', attributes: { category: 'person', label: 'Angkat, Suratman' } },
    //     { key: 'i-001', attributes: { category: 'infringement', label: 'Unlicensed manufacture and hawking of curry puffs' } },
    //   ],
    //   edges: [
    //     { source: 'p-001', target: 'i-001', attributes: { label: 'HAS_INFRINGEMENT' } },
    //     { source: 'p-002', target: 'i-001', attributes: { label: 'HAS_INFRINGEMENT' } },
    //     { source: 'p-003', target: 'i-001', attributes: { label: 'HAS_INFRINGEMENT' } },
    //     { source: 'p-004', target: 'i-001', attributes: { label: 'HAS_INFRINGEMENT' } },
    //     { source: 'p-005', target: 'i-001', attributes: { label: 'HAS_INFRINGEMENT' } },
    //     { source: 'p-006', target: 'i-001', attributes: { label: 'HAS_INFRINGEMENT' } },
    //   ],
    // });

    // #region Add nodes and edges
    // // graph.addNode("John", { size: 20, label: "John", color: "blue", type: "image", image: userSvg });
    // // graph.addNode("Mary", { size: 20, label: "Mary", color: "blue", type: "image", image: userSvg });

    // // // graph.addEdge("John", "Mary");
    // // // graph.addEdge("John", "Mary", { type: "line", label: "works with", size: 3 });
    // // graph.addEdge("John", "Mary", { type: "arrow", label: "works with", size: 3 });

    // graph.addNode("Hamza Affridi", { size: 20, label: "Hamza Affridi", color: "purple", type: "image", image: userSvg });
    // graph.addNode("Unlicensed manufacture and hawking of curry puffs", { size: 20, label: "Unlicensed manufacture and hawking of curry puffs", color: "orange", type: "circle" });
    // graph.addEdge("Hamza Affridi", "Unlicensed manufacture and hawking of curry puffs", { type: "arrow", label: "commited", size: 3 });

    // graph.addNode("Lia Caniago, Robiah", { size: 20, label: "Lia Caniago, Robiah", color: "purple", type: "image", image: userSvg });
    // graph.addNode("Illegal hawking of food", { size: 20, label: "Illegal hawking of food", color: "orange", type: "circle" });
    // graph.addEdge("Lia Caniago, Robiah", "Unlicensed manufacture and hawking of curry puffs", { type: "arrow", label: "commited", size: 3 });
    // graph.addNode("Derek Ho", { size: 20, label: "Derek Ho", color: "purple", type: "image", image: userSvg });
    // graph.addEdge("Lia Caniago, Robiah", "Derek Ho", { type: "arrow", label: "knows", size: 3 });
    // graph.addNode("Blk 63B, Lengkok Bahru", { size: 20, label: "Blk 63B, Lengkok Bahru", color: "brown", type: "image", image: citySvg });
    // graph.addEdge("Lia Caniago, Robiah", "Blk 63B, Lengkok Bahru", { type: "arrow", label: "stays at", size: 3 });
    // graph.addNode("Footprint Hostel", { size: 20, label: "Footprint Hostel", color: "brown", type: "image", image: citySvg });
    // graph.addEdge("Lia Caniago, Robiah", "Footprint Hostel", { type: "arrow", label: "works at", size: 3 });
    // graph.addNode("88A Clementi Avenue 5", { size: 20, label: "88A Clementi Avenue 5", color: "brown", type: "image", image: citySvg });
    // graph.addEdge("Derek Ho", "88A Clementi Avenue 5", { type: "arrow", label: "stays at", size: 3 });

    // graph.addNode("Silva Widodo", { size: 20, label: "Silva Widodo", color: "purple", type: "image", image: userSvg });
    // graph.addNode("Illegal hawking of curry puffs", { size: 20, label: "Illegal hawking of curry puffs", color: "orange", type: "circle" });
    // graph.addEdge("Silva Widodo", "Illegal hawking of curry puffs", { type: "arrow", label: "commited", size: 3 });

    (() => {
      // graph.addNode("p-001", {
      //   x: 1,
      //   y: 1,
      //   size: 40,
      //   label: "Lia Caniago, Robiah",
      //   color: "purple",
      //   type: "image",
      //   image: userSvg,
      // });

      // graph.addNode("i-001", {
      //   x: 1,
      //   y: 1,
      //   size: 40,
      //   label: "Unlicensed manufacture and hawking of curry puffs",
      //   type: "circle",
      //   color: "orange",
      // });

      // graph.addEdge("p-001", "i-001", {
      //   type: "arrow",
      //   label: "HAS_INFRINGEMENT",
      //   size: 5,
      // });

      if (query) {
        const components = connectedComponents(refGraph);
        console.log('components', components);
        // const simplePaths = allSimplePaths(graph);
        // console.log('simplePaths', simplePaths);

        const filterNodes = refGraph.filterNodes((node, attributes) => {
          const q = query.toLowerCase();
          return (
            q.includes(attributes.label?.toLowerCase())
            || q.includes(attributes.firstName?.toLowerCase())
            || q.includes(attributes.lastName?.toLowerCase())
            || attributes.label?.toLowerCase().includes(q)
          );
        });
        // console.log('filterNodes', filterNodes);
        // console.log('permutation(filterNodes)', permutation(filterNodes));

        // permutation(filterNodes).filter((nodes) => {
        //   for (let i = 1; i < nodes.length; i++) {
        //     const element = nodes[i];
        //     if (!refGraph.hasEdge(nodes[i - 1], nodes[i])) {
        //       return false;
        //     }
        //   }
        //   return true;
        // }).reduce((acc, nodes) => {
        //   acc.push(...nodes);
        //   return acc;
        // }, []).forEach((node) => {
        //   addNode(graph, node, refGraph.getNodeAttributes(node));
        // });

        permutation(filterNodes)
          .reduce((acc, nodes) => {
            const edges = [];
            for (let i = 1; i < nodes.length; i++) {
              if (!refGraph.hasEdge(nodes[i - 1], nodes[i])) {
                return acc;
              }
              edges.push({ source: nodes[i - 1], target: nodes[i] })
            }
            acc[0].push(...nodes);
            acc[1].push(...edges);
            return acc;
          }, [[], []])
          .map((result) => {
            console.log('result', result);
            return result;
          })
          .forEach((item, i) => {
            if (i === 0) {
              const nodes = item;
              nodes.forEach((n) => {
                if (!graph.hasNode(n)) {
                  addNode(graph, n, refGraph.getNodeAttributes(n));
                  hasNewNode = true;
                }
              });
            } else if (i === 1) {
              const edges = item;
              edges.forEach((e) => {
                addEdge(graph, e, refGraph.getEdgeAttributes(e.source, e.target));
              });
            }
          });

        if (selectedSuggestions.length > 0) {
          // const filteredEdges = refGraph.filterEdges((edge, attributes, source, target, sourceAttributes, targetAttributes, undirected) => {
          //   return selectedSuggestions.includes(attributes.label) && graph.hasNode(source);
          // });
          // console.log('filteredEdges:', filteredEdges);
          refGraph
            .reduceEdges((acc, edge, attributes, source, target, sourceAttributes, targetAttributes, undirected) => {
              if (
                selectedSuggestions.includes(attributes.label)
                && graph.hasNode(source)
              ) {
                acc[0].push({ key: target, attributes: targetAttributes });
                acc[1].push({ source, target, attributes });
              }
              return acc;
            }, [[], []])
            .forEach((item, i) => {
              if (i === 0) {
                const nodes = item;
                nodes.forEach((n) => {
                  if (!graph.hasNode(n.key)) {
                    addNode(graph, n.key, n.attributes);
                    hasNewNode = true;
                  }
                });
              } else if (i === 1) {
                const edges = item;
                edges.forEach((e) => {
                  addEdge(graph, { source: e.source, target: e.target }, e.attributes);
                });
              }
            });
        }

        // const refInitialNodes = refGraph.filterNodes((node, attributes) => {
        //   return (
        //     attributes.label.toLowerCase().includes('Lia Caniago'.toLowerCase())
        //     || attributes.label.toLowerCase().includes('Robiah'.toLowerCase())
        //     // || attributes.label.includes('Unlicensed manufacture and hawking of curry')
        //   );
        // });

        // bfsFromNode(refGraph, 'p-001', (node, attributes, depth) => {
        //   if (attributes.label.toLowerCase().includes('Unlicensed manufacture and hawking of curry'.toLowerCase())) {
        //     refInitialNodes.push(node);
        //     return true;
        //   }
        //   return depth >= 1;
        // });

        // const refInitialEdges = refGraph.edges(...refInitialNodes);
        // // console.log('refInitialEdges:', refInitialEdges);

        // refInitialNodes.forEach((node) => {
        //   addNode(graph, node, refGraph.getNodeAttributes(node));
        // });

        // refInitialEdges.forEach((edge) => {
        //   const [source, target] = refGraph.extremities(edge);
        //   addEdge(graph, { source, target }, refGraph.getEdgeAttributes(edge));
        // });
      } else {
        graph.clear();
      }
      // graph.clear();
      // graph.import(refGraph);
    })();
    // #endregion

    // #region Set nodes position
    // graph.nodes().forEach((node, i) => {
    //   // const angle = (i * 2 * Math.PI) / graph.order;
    //   // graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
    //   // graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
    
    //   // graph.setNodeAttribute(node, "x", 1);
    //   // graph.setNodeAttribute(node, "y", 1);

    //   if (i === 0) {
    //     graph.setNodeAttribute(node, "x", 1);
    //     graph.setNodeAttribute(node, "y", 1);
    //   }
    // });

    if (hasNewNode) {
      // console.log(graph.toJSON());
      // circular.assign(graph, { scale: 200 });
      // random.assign(graph);
      // forceLayout.assign(graph, 200);
      // // noverlap.assign(graph, 20);
      // noverlap.assign(graph, {
      //   maxIterations: 200,
      //   settings: {
      //     expansion: 2,
      //     // gridSize: 1,
      //     margin: 20,
      //     ratio: 1,
      //   },
      // });

      // forceAtlas2.assign(graph, {
      //   iterations: 6000,
      //   settings: {
      //     ...forceAtlas2.inferSettings(graph),
      //     adjustSizes: true,
      //     // gravity: 2,
      //     // edgeWeightInfluence: 3,
      //     linLogMode: true,
      //     outboundAttractionDistribution: true,
      //   },
      // });
      // noverlap.assign(graph, {
      //   maxIterations: 200,
      //   settings: {
      //     gridSize: 1,
      //     margin: 50,
      //     expansion: 10,
      //     ratio: 2,
      //   },
      // });

      // random.assign(graph);
      // const positions = forceAtlas2(graph, {
      //   iterations: 2000,
      //   settings: {
      //     ...forceAtlas2.inferSettings(graph),
      //     adjustSizes: true,
      //     gravity: 1,
      //     // edgeWeightInfluence: 3,
      //     scalingRatio: 3,
      //     linLogMode: true,
      //     outboundAttractionDistribution: true,
      //   },
      // });
      // animateNodes(graph, positions, { duration: 200, easing: "linear" }, () => {
      //   const positions = noverlap(graph, {
      //     maxIterations: 50,
      //     inputReducer: (key, attributes) => ({
      //       x: attributes.x,
      //       y: attributes.y,
      //       size: attributes.size
      //     }),
      //     settings: {
      //       gridSize: 10,
      //       ratio: 1,
      //     },
      //   });
      //   animateNodes(graph, positions, { duration: 200, easing: "linear" });
      // });

      // const layout = new FA2Layout(graph, {
      //   // settings: {
      //   //   gravity: 1
      //   // },
      //   settings: {
      //     ...forceAtlas2.inferSettings(graph),
      //     adjustSizes: true,
      //     // gravity: 2,
      //     // edgeWeightInfluence: 3,
      //     linLogMode: true,
      //     outboundAttractionDistribution: true,
      //   },
      // });
      // console.log('forceAtlas2.inferSettings(graph):', forceAtlas2.inferSettings(graph));
      // layout.start();

      // setTimeout(() => {
      //   layout.stop();
      //   // noverlap.assign(graph, {
      //   //   maxIterations: 200,
      //   //   settings: {
      //   //     expansion: 2,
      //   //     // gridSize: 1,
      //   //     margin: 20,
      //   //     ratio: 1,
      //   //   },
      //   // });
      // }, 50000);
    }
    // #endregion

    const renderer = new Sigma(graph, container, {
      nodeProgramClasses: {
        image: getNodeProgramImage(),
      },
      renderEdgeLabels: true,

      defaultEdgeType: 'arrow',
      labelSize: 12,
      edgeLabelSize: 8,
    
      // enableEdgeClickEvents: true,
      // enableEdgeWheelEvents: true,
      // enableEdgeHoverEvents: "debounce",
      // edgeReducer(edge, data) {
      //   const res = { ...data };
      //   if (edge === hoveredEdge) res.color = "#cc0000";
      //   return res;
      // },
    });
    window.sigma = renderer;

    renderer.on("downNode", (e) => {
      // console.log('downNode', e);
      node = e.node;
      setNode(node);

      neighbourNodes = new Set(graph.neighbors(e.node))
      setNeighbourNodes(neighbourNodes);

      isDragging = true;
      setIsDragging(isDragging);

      // graph.setNodeAttribute(node, "highlighted", true);

      renderer.refresh();
      // console.log('downNode isDragging:', isDragging);
    });

    renderer.on("clickStage", () => {
      node = null;
      setNode(node);

      neighbourNodes = new Set();
      setNeighbourNodes(neighbourNodes);

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
          // .darken(30)
          // .setAlpha(0.3)
          .desaturate(80)
          // .lighten(20)
          // .spin(25)
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
      // console.log("mousemovebody", e);
      // console.log("mousemovebody isDragging", isDragging);
      if (!isDragging || !node) {
        return;
      }

      // Get new position of node
      const pos = renderer.viewportToGraph(e);

      graph.setNodeAttribute(node, "x", pos.x);
      graph.setNodeAttribute(node, "y", pos.y);

      // Prevent sigma to move camera:
      e.preventSigmaDefault();
      e.original.preventDefault();
      e.original.stopPropagation();
    });

    // On mouse up, we reset the autoscale and the dragging mode
    renderer.getMouseCaptor().on("mouseup", () => {
      if (node) {
        graph.removeNodeAttribute(node, "highlighted");
      }
      isDragging = false;
      setIsDragging(isDragging);
    });

    // Disable the autoscale at the first down interaction
    renderer.getMouseCaptor().on("mousedown", () => {
      // TODO: Causing node rendering far away, commented until found better solution
      if (!renderer.getCustomBBox()) {
        renderer.setCustomBBox(renderer.getBBox());
      }
      // if (graph.order > 0 && !renderer.getCustomBBox()) {
      //   renderer.setCustomBBox(renderer.getBBox());
      // }
    });
    // #endregion

    renderer.on("doubleClickNode", (e) => {
      console.log('doubleClickNode');
      node = e.node;
      setNode(node);

      isDragging = false;
      setIsDragging(isDragging);

      // graph.setNodeAttribute(node, "highlighted", true);

      const refGraphNeighbors = refGraph.neighbors(node);
      const graphNeighbors = graph.neighbors(e.node);
      const x = graph.getNodeAttribute(e.node, 'x');
      const y = graph.getNodeAttribute(e.node, 'y');
      const addedNodes = [];

      if (graphNeighbors.length !== refGraphNeighbors.length) {
        console.log('refGraphNeighbors', refGraphNeighbors);
        // Expand
        refGraphNeighbors.forEach((refGraphNode) => {
          if (!graph.hasNode(refGraphNode)) {
            addNode(graph, refGraphNode, { ...refGraph.getNodeAttributes(refGraphNode), x, y });
            addedNodes.push(refGraphNode);
          }
          // if (!graph.hasEdge(node, refGraphNode) && !graph.hasEdge(refGraphNode, node)) {
          //   if (refGraph.hasEdge(node, refGraphNode)) {
          //     addEdge(graph, { source: node, target: refGraphNode }, refGraph.getEdgeAttributes(node, refGraphNode));
          //   } else if (refGraph.hasEdge(refGraphNode, node)) {
          //     addEdge(graph, { source: refGraphNode, target: node }, refGraph.getEdgeAttributes(refGraphNode, node));
          //   }
          // }
          refGraph.neighbors(refGraphNode).forEach((n) => {
            if (graph.hasNode(n)) {
              if (refGraph.hasEdge(n, refGraphNode)) {
                addEdge(graph, { source: n, target: refGraphNode }, refGraph.getEdgeAttributes(n, refGraphNode));
              } else if (refGraph.hasEdge(refGraphNode, n)) {
                addEdge(graph, { source: refGraphNode, target: n }, refGraph.getEdgeAttributes(refGraphNode, n));
              }
            }
          });
        });
        // const positions = noverlap(graph, {
        //   maxIterations: 50,
        //   inputReducer: (key, attributes) => ({
        //     x: attributes.x,
        //     y: attributes.y,
        //     size: attributes.size
        //   }),
        //   settings: {
        //     gridSize: 10,
        //     ratio: 1,
        //   },
        // });
        // console.log('positions', positions);
        // noverlap.assign(graph, {
        //   maxIterations: 2000,
        //   settings: {
        //     // expansion: 2,
        //     gridSize: 20,
        //     // margin: 5,
        //     ratio: 10,
        //   },
        // });
        // const positions = forceAtlas2(graph, {
        //   iterations: 2000,
        //   settings: {
        //     ...forceAtlas2.inferSettings(graph),
        //     adjustSizes: true,
        //     gravity: 1,
        //     // edgeWeightInfluence: 3,
        //     scalingRatio: 3,
        //     linLogMode: true,
        //     outboundAttractionDistribution: true,
        //   },
        // });

        const positions = addedNodes.reduce((acc, node) => {
          const { x: refX, y: refY} = refGraph.getNodeAttributes(node);
          return Object.assign(acc, {
            [node]: {
              x: refX,
              y: refY,
            },
          });
        }, {});
        // console.log('positions:', positions);
        animateNodes(graph, positions, { duration: 200, easing: "linear" }, () => {
          // const positions = noverlap(graph, {
          //   maxIterations: 500,
          //   inputReducer: (key, attributes) => ({
          //     x: attributes.x,
          //     y: attributes.y,
          //     size: attributes.size
          //   }),
          //   settings: {
          //     // gridSize: 10,
          //     // ratio: 1,
          //   },
          // });
          // animateNodes(graph, positions, { duration: 200, easing: "linear" });
        });
      } else {
        // Collapse
        const positions = {};
        // const neighbours = graph.neighbors(e.node)
        //   // .filter((n) => graph.neighbors(n).length === 1)
        //   .filter((n) => graph.getNodeAttribute(n, 'renderedAt') > graph.getNodeAttribute(e.node, 'renderedAt'));

        // neighbours.forEach((n) => {
        //   positions[n] = { x, y };
        //   bfsFromNode(graph, n, function (n2, attr, depth) {
        //     // console.log(n2)
        //     if (graph.getNodeAttribute(n2, 'renderedAt') > graph.getNodeAttribute(e.node, 'renderedAt')) {
        //       positions[n2] = { x, y };
        //     }
        //   });
        // });

        bfsFromNode(graph, e.node, (n, attr, depth) => {
          if (graph.getNodeAttribute(n, 'renderedAt') > graph.getNodeAttribute(e.node, 'renderedAt')) {
            console.log('n', graph.getNodeAttribute(n, 'label'), ':', new Date(graph.getNodeAttribute(n, 'renderedAt')).toISOString());
          }
        }, { mode: 'directed' });

        const findDescendants = (node, descendants = []) => {
          // const neighbors = graph.neighbors(node).filter((n) => graph.getNodeAttribute(n, 'renderedAt') > graph.getNodeAttribute(e.node, 'renderedAt'));
          // descendants.push(...neighbors);
          graph.neighbors(node).forEach((n) => {
            if (graph.getNodeAttribute(n, 'renderedAt') > graph.getNodeAttribute(e.node, 'renderedAt') && !descendants.includes(n)) {
              descendants.push(n);
              findDescendants(n, descendants);
            }
          });
          return descendants;
        };
        console.log(`findDescendants(${e.node}):`, findDescendants(e.node));
        findDescendants(e.node).forEach((n) => {
          positions[n] = { x, y };
        });

        animateNodes(graph, positions, { duration: 200, easing: "linear" }, () => {
          // neighbours.forEach((n) => {
          //   graph.dropNode(n);
          // });
          Object.keys(positions).forEach((n) => {
            graph.dropNode(n);
          });
        });
      }

      neighbourNodes = new Set(graph.neighbors(e.node))
      setNeighbourNodes(neighbourNodes);

      // Prevent sigma to move camera:
      e.preventSigmaDefault();
      e.original?.preventDefault();
      e.original?.stopPropagation();
      e.event.original?.preventDefault();
      e.event.original?.stopPropagation();

      renderer.refresh();
    });

    // graph.on('nodeAdded', function({key}) {
    //   graph
    // });

    return () => {
      renderer.kill();
    };
  }, [
    // node,
    // neighbourNodes,
    // isDragging,
    query,
    selectedSuggestions,
  ]);

  return (
    <div className={`w-full h-full bg-slate-100 select-none	${props.className ?? ''}`}>
      <div id="sigma-container" className="w-full h-full"></div>
      {/* {children} */}
    </div>
  )
}

export default memo(Board);
