// import Badge from './Badge';

// export default function NodeInfo({ className, node }) {
//   return (
//     <>
//       <div
//         className={`${className ?? ''}`}
//       >
//         <div
//           className="bg-white block rounded-md shadow-md">
//           <div
//             className="border-b-2 border-neutral-100 px-6 py-3">
//             <Badge text={node.category} color={node.color} />
//             <span className='pl-4 font-bold'>
//               {node.label}
//             </span>
//           </div>

//           <div className="p-6">
//             {
//               Object.keys(node)
//                 .filter((key) => !['x', 'y', 'size', 'color', 'type', 'image', 'category', 'label', 'renderedAt'].includes(key))
//                 .map((key) => (
//                   // <div key={key} className="flex py-2">
//                   //   <div className="flex-1 font-bold">{key}</div>
//                   //   <div className="flex-1">{node[key]}</div>
//                   // </div>

//                   <div key={key} className="grid grid-cols-2 gap-4 py-2">
//                     <div className="col-span-1 font-bold">{key}</div>
//                     <div className="col-span-1 ">{node[key]}</div>
//                   </div>

                  
//                 ))
//             }
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }


import Badge from './Badge';

 

export default function NodeInfo({ className, node }) {

  return (

    <>

      <div

        className={`${className ?? ''}`}

      >

        <div

          className="bg-white block rounded-md shadow-md">

          <div

            className="border-b-2 border-neutral-100 px-6 py-3">

            <Badge text={node.category} color={node.color} />

            <span className='pl-4 font-bold'>

              {node.label}

            </span>

          </div>

 

          <div className="p-6 flex gap-4">

          <div  className="flex-col gap-4 py-2">

            {

              Object.keys(node)

                .filter((key) => !['x', 'y', 'size', 'color', 'type', 'image', 'category', 'label', 'renderedAt'].includes(key))

                .map((key) => (

                    <div className="flex-1 font-bold py-1" key={key}>{key}</div>

                ))

            }

            </div>

            <div className="flex-col gap-4 py-2">

            {

              Object.keys(node)

                .filter((key) => !['x', 'y', 'size', 'color', 'type', 'image', 'category', 'label', 'renderedAt'].includes(key))

                .map((key) => (

                    <div className="flex-auto flex-wrap py-1" key={key}>{node[key]}</div>

                ))

            }

             </div>

          </div>

        </div>

      </div>

    </>

  )

}