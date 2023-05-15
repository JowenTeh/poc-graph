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
import { useRef, useState } from 'react';
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
  const boardRef = useRef();

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
          ref={boardRef}
        >
        </Board>
        <SearchBar className="absolute top-6 left-6 w-2/6" query={query} onSearch={onSearch} />
        {/* {query && graph.order > 1 && <Suggestion className="absolute top-24 left-6 w-2/6" suggestions={suggestions} selectedSuggestions={selectedSuggestions} onSelectedSuggestionsChange={setSelectedSuggestions} />} */}
        <div className="absolute top-24 left-6 w-2/6">
          {/* {node && graph.hasNode(node) && <button className="bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByLevel(node, 100)}}>Expand all</button>} */}
          {node && graph.hasNode(node) && <button className="bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByLevel(node, 2)}}>Expand 2 levels</button>}
          {!node &&
            <>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['p-001', 'i-001'])}}>Step 1 (Event-Case Report)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['p-002', 'p-003', 'p-004', 'p-005', 'p-006', 'p-007', 'l-001'])}}>Step 2 (Person)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['i-002', 'i-003', 'i-004', 'l-004', 'l-005', 'l-006'])}}>Step 3a (Event)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['l-001', 'l-002', 'l-003'])}}>Step 3b (Location)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['b-001', 'b-002', 'p-008'])}}>Step 4 (Business & person)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['p-009', 'p-011', 'l-007'])}}>Step 5 (Derek's relationship)</button>
            </>
          }
          {/* <button className="bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['w-001'])}}>Step 5b</button> */}
          {/* <button className="bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['b-003', 'w-002', 'w-003', 'p-010'])}}>Extra</button> */}
        </div>
        {query && node && graph.hasNode(node) && <NodeInfo className={`absolute ${query ? /* 'top-44' */ 'top-36' : 'top-24'} left-6 w-2/6`} node={{degree: graph.degree(node), ...graph.getNodeAttributes(node)}} />}
      </div>
    </>
  )
}
