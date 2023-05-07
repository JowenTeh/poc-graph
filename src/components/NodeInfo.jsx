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
            className="border-b-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
            <Badge text={node.category} color={node.color} />
            <span className='pl-4 font-bold'>
              {node.label}
            </span>
          </div>

          <div className="p-6">
            {
              Object.keys(node)
                .filter((key) => !['x', 'y', 'size', 'color', 'type', 'image', 'category', 'label'].includes(key))
                .map((key) => (
                  <div key={key} className="flex py-2">
                    <div className="flex-1 font-bold">{key}</div>
                    <div className="flex-1">{node[key]}</div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
