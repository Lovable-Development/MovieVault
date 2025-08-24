import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-4">
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
};

export default Index;
