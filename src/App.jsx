// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className="App">
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </div>
//   )
// }

// export default App

import Graph from 'graphology';
import { useState } from 'react';
import NodeInfo from './components/NodeInfo';
import Board from './components/Board';
import SearchBar from './components/SearchBar';
import Suggestion from './components/Suggestion';
import graphData from './data/graph';

export default function App() {
  const [node, setNode] = useState();
  const [neighbourNodes, setNeighbourNodes] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'Expand 3 levels',
    'STAYS_AT',
    'HAS_INFRINGEMENT',
    'HAS_WORK_PERMIT',
    'IS_ISSUED_BY',
    // 'OWNS',
    // 'LOCATED_AT',
    // 'EMPLOYS',
  ]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [refGraph] = useState(Graph.from(graphData));
  const [graph] = useState(new Graph());
  const [query, setQuery] = useState('Unlicensed manufacture and hawking of curry puffs at Blk 63B, Lengkok Bahru which involves Robiah');

  window.graph = graph;

  const onSearch = (query) => {
    setQuery(query);

    // setSuggestions([
    //   'STAYS_AT',
    //   'HAS_INFRINGEMENT',
    // ]);
  };

  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1> */}

      <div className="w-screen h-screen">
        <Board
          className="fixed top-0 left-0"
          graph={graph}
          refGraph={refGraph}
          node={node}
          setNode={setNode}
          neighbourNodes={neighbourNodes}
          setNeighbourNodes={setNeighbourNodes}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          query={query}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          selectedSuggestions={selectedSuggestions}
        >
        </Board>
        <SearchBar className="absolute top-6 left-6 w-2/6" query={query} onSearch={onSearch} />
        {query && graph.order > 1 && <Suggestion className="absolute top-24 left-6 w-2/6" suggestions={suggestions} selectedSuggestions={selectedSuggestions} onSelectedSuggestionsChange={setSelectedSuggestions} />}
        {query && node && graph.hasNode(node) && <NodeInfo className={`absolute ${query ? 'top-44' : 'top-24'} left-6 w-2/6`} node={{degree: graph.degree(node), ...graph.getNodeAttributes(node)}} />}
      </div>
    </>
  )
}
