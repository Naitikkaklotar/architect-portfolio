export const metadata = {
  title: "Portfolio Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-black" style={{ margin: 0 }}>
      {children}
    </div>
  );
}
