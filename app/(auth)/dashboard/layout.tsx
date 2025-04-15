import { Header, Sidebar } from "@/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-wrapper min-h-screen flex flex-col lg:flex-row">
      <div className="layout-sidebar w-full lg:w-72 bg-gray-100">
        <Sidebar />
      </div>
      <div className="layout-main flex-1">
        <main className="layout-content w-full max-w-screen-xl mx-auto px-4">
          {children}
        </main>
      </div>
    </div>
  );
}
