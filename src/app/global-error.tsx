'use client' // Error boundaries must be Client Components
 
export default function GlobalError({
  reset,
}: {
  error?: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body className=" dark:bg-slate-900 bg-white">
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}