import SimpleEmptyChat from "@/components/empty-chat-container/SimpleEmptyChat";

const TestEmptyChat = () => {
  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      <div className="p-4">
        <h2 className="text-white text-xl mb-2">DevConnect Empty Chat Test</h2>
        <p className="text-gray-400">This is how the empty chat state looks</p>
      </div>

      <div className="flex-1 flex">
        <SimpleEmptyChat />
      </div>
    </div>
  );
};

export default TestEmptyChat;
