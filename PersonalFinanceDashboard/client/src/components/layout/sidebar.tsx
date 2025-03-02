import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Home, LogOut, PieChart } from "lucide-react";

export default function Sidebar() {
  const { logoutMutation } = useAuth();

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-50 to-background border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">
          Finance Manager
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="w-full justify-start hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/transactions">
          <Button 
            variant="ghost" 
            className="w-full justify-start hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <PieChart className="mr-2 h-4 w-4" />
            Transactions
          </Button>
        </Link>
      </nav>

      <div className="p-4 border-t border-border/50">
        <Button 
          variant="outline" 
          className="w-full bg-gray-50 hover:bg-gray-100 hover:text-primary transition-colors"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}