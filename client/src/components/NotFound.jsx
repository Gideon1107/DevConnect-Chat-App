

const NotFound = () => {
    return (
        <div className="pt-16 min-h-screen bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-xl text-gray-400 mb-8">Page not found</p>
                <a href="/" className="text-blue-500 hover:text-blue-400">
                    Return to home
                </a>
            </div>
        </div>
    )
}

export default NotFound