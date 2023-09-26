import { useEffect, useRef, useState } from 'react';
import NodeInfo from './components/NodeInfo';
import Board from './components/Board';
import SearchBar from './components/SearchBar';

export default function App() {
  const [node, setNode] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [query, setQuery] = useState('');
  const boardRef = useRef();

  const [refGraph, setRefGraph] = useState();
  const [graph, setGraph] = useState();

  useEffect(() => {
    const sampleQuery = '';
    setQuery(sampleQuery);
    boardRef.current.changeQuery(sampleQuery);
  }, []);

  return (
    <>
      <div className="w-screen h-screen">
        <Board
          className="fixed top-0 left-0"
          node={node}
          setNode={setNode}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          query={query}
          ref={boardRef}
          onRefGraphChange={(g) => setRefGraph(g)}
          onGraphChange={(g) => setGraph(g)}
        >
        </Board>
        {/* <SearchBar className="absolute top-6 left-6 w-2/6" query={query} setQuery={setQuery} onSearch={(query) => { setQuery(query); boardRef.current.changeQuery(query); }} /> */}
        <div className="absolute top-24 left-6 w-2/6">
          {node && graph.hasNode(node) && <button className="bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByLevel(node, 2)}}>Expand 2 levels</button>}
          {/* {!node &&
            <>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['p-001', 'i-001'])}}>Step 1 (Event-Case Report)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['p-002', 'p-003', 'p-004', 'p-005', 'p-006', 'p-007', 'l-001'])}}>Step 2 (Person)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['i-002', 'i-003', 'i-004', 'l-004', 'l-005', 'l-006'])}}>Step 3a (Event)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['l-001', 'l-002', 'l-003'])}}>Step 3b (Location)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['b-001', 'b-002', 'p-008'])}}>Step 4 (Business & person)</button>
              <button className="block bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white" onClick={() => {boardRef.current.expandByNodes(['p-009', 'p-011', 'l-007'])}}>Step 5 (Derek's relationship)</button>
            </>
          } */}
        </div>
        {node && graph.hasNode(node) && <NodeInfo className={`absolute ${query ? 'top-36' : 'top-24'} left-6`} node={{degree: graph.degree(node), ...graph.getNodeAttributes(node)}} />}
      </div>
    </>
  )
}
