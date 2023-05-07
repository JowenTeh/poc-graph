export default function Badge({ text, color }) {
  return (
    <span
      className="inline-block whitespace-nowrap rounded-[0.27rem] bg-red-500 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-white"
      style={{ background: color }}
    >
    {text}
    </span>
  )
}
