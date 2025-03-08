
export const Community = () => {

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
        <h1 className="text-4xl font-bold text-white mb-8">Community</h1>
        <p className="text-xl text-gray-400">
          Join thousands of developers sharing knowledge and building together.
        </p>
      </div>
    </div>
  )
}