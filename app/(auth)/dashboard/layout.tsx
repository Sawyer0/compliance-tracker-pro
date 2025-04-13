import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="w-[30%] min-w-[250px] max-w-sm border-r">
        <Sidebar />
      </div>

      <div className="w-[70%] flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
