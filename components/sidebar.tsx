"use client"

// Sidebar with only navigation links

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none") +
          " fixed left-0 right-0 top-16 bottom-0 bg-black/40 z-40 transition-opacity duration-200"
        }
        onClick={onClose}
      />
      {/* Sidebar panel */}
      <aside
        className={
          (open ? "translate-x-0" : "-translate-x-full") +
          " fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border shadow-lg transition-transform duration-200"
        }
     >
        <nav className="p-4 space-y-2">
          <a className="block px-3 py-2 rounded-md hover:bg-muted" href="#">Dashboard</a>
          <a className="block px-3 py-2 rounded-md hover:bg-muted" href="#">Profile</a>
          <a className="block px-3 py-2 rounded-md hover:bg-muted" href="#">Settings</a>
        </nav>
      </aside>
    </>
  )
}
