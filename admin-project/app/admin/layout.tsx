export const metadata = {
  title: "Karirak Admin — Import",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", zIndex: 0 }}>
      <style>{`
        /* Hide public Navbar & Footer inside /admin routes */
        body:has([data-admin-page]) nav,
        body:has([data-admin-page]) footer {
          display: none !important;
        }
        body:has([data-admin-page]) main {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      {children}
    </div>
  );
}
