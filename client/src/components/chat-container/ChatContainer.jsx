import ChatHeader from "./components/ChatHeader"
import MessageInput from "./components/MessageInput"
import MessageContainer from "./components/MessageContainer"
import { useEffect, useState } from "react"


const ChatContainer = () => {
  const [visualViewport, setVisualViewport] = useState({
    height: window.innerHeight,
    isKeyboardOpen: false
  });

  // Handle visual viewport changes (keyboard opening/closing)
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const isKeyboardOpen = window.innerHeight - window.visualViewport.height > 150;
        setVisualViewport({
          height: window.visualViewport.height,
          isKeyboardOpen
        });
      }
    };

    // Add event listeners
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed top-0 h-[100dvh] w-[100vw] bg-slate-900 flex flex-col md:static md:flex-1">
      <div className="sticky top-0 z-[999] bg-slate-900 shadow-md">
        <ChatHeader/>
      </div>
      <MessageContainer/>
      <div className={`${visualViewport.isKeyboardOpen ? 'sticky bottom-0' : ''} z-[999] bg-slate-900`}>
        <MessageInput isKeyboardOpen={visualViewport.isKeyboardOpen} />
      </div>
    </div>
  )
}

export default ChatContainer