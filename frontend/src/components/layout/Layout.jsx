import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Navigation Drawer / Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Content wrapper */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Mobile Header Bar */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20">
          <div className="mx-auto max-w-6xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
