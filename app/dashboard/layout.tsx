import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar /> 
      <div className="flex flex-col flex-1">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
