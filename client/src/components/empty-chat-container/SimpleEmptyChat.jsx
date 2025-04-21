const SimpleEmptyChat = () => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900/50 justify-center items-center p-4 overflow-hidden">
      {/* Animation container with fixed dimensions */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-16 md:mb-20 mt-4"> {/* Made responsive */}
        {/* Outer circle with rotation animation */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-blue-500/30 absolute top-0 left-0 animate-spin-slow"></div>

        {/* Middle circle with opposite rotation */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-blue-500/50 absolute top-4 left-4 animate-spin-reverse"></div>

        {/* Inner circle with pulse effect */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-blue-500/20 flex items-center justify-center absolute top-8 left-8 animate-pulse">
          <div className="text-blue-500 text-4xl sm:text-5xl">💬</div>
        </div>
      </div>

      <div className="text-center max-w-md px-4"> {/* Added max-width and padding */}
        <h3 className='text-lg sm:text-xl font-semibold text-blue-500 mb-2'>Welcome to DevConnect Chat</h3>
        <p className='text-gray-300 mb-2'>Select a conversation to start messaging</p>
        <p className='text-xs sm:text-sm text-gray-400 mt-4'>Connect with developers around the world</p>
      </div>
    </div>
  );
};

export default SimpleEmptyChat;
