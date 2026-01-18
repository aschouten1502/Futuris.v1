export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-futuris-teal/10 rounded w-2/3 animate-pulse" />
      <div className="h-4 bg-futuris-teal/5 rounded w-full animate-pulse" />
      <div className="space-y-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse"
          >
            <div className="h-5 bg-futuris-teal/10 rounded w-1/2 mb-3" />
            <div className="h-4 bg-futuris-teal/5 rounded w-full mb-2" />
            <div className="h-4 bg-futuris-teal/5 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
