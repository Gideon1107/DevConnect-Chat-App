
export const Features = () => {


  const scrollToTop = () => {
    window
      .scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  scrollToTop()

  return (
    <div className="pt-16 min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-white mb-8">Features</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Real-time Chat</h2>
            <p className="text-gray-400">Connect instantly with developers worldwide through our real-time messaging system.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Code Sharing</h2>
            <p className="text-gray-400">Share and discuss code snippets with syntax highlighting and collaborative editing.</p>
          </div>
          {/* Add more feature cards as needed */}
        </div>
      </div>
    </div>
  )
}