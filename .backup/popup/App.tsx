import reactLogo from "@/assets/react.svg";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import wxtLogo from "/wxt.svg";

function App() {
  const [count, setCount] = useState(0);

  const openSidePanel = async () => {
    try {
      // 获取当前活动标签页
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        // 打开 side panel
        await browser.sidePanel.open({ tabId: tab.id });
      }
    } catch (error) {
      console.error('打开 side panel 失败:', error);
    }
  };

  return (
    <div className="w-80 p-4 space-y-4 bg-white rounded-md shadow-md">
      <div className="flex justify-center items-center space-x-4">
        <a href="https://wxt.dev" target="_blank" rel="noopener noreferrer">
          <img src={wxtLogo} className="h-8 w-auto" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="h-8 w-auto" alt="React logo" />
        </a>
      </div>

      <h1 className="text-xl font-semibold text-center text-gray-800">
        WXT + React
      </h1>

      <div className="bg-gray-100 p-4 rounded-md shadow-inner flex flex-col items-center">
        <Button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </Button>

        <Button 
          onClick={openSidePanel}
          variant="outline"
          className="w-full"
        >
          打开 Side Panel
        </Button>
        
        <p className="text-sm mt-2 text-gray-600 text-center">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="text-xs text-center text-gray-500">
        Click on the WXT and React logos to learn more
      </p>
    </div>
  );
}

export default App;
