import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/layout/sidebar";
import BudgetGoalForm from "@/components/budget-goal-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function BudgetGoalsPage() {
  const { toast } = useToast();

  const { data: goals, isLoading } = useQuery({
    queryKey: ["/api/budget-goals"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/budget-goals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget-goals"] });
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
    },
  });

  const updateGoalProgress = useMutation({
    mutationFn: async ({ id, amount }) => {
      const res = await apiRequest("PATCH", `/api/budget-goals/${id}`, {
        currentAmount: amount,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget-goals"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 via-white to-background">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Budget Goals
          </h1>
          <BudgetGoalForm />
        </div>

        <div className="grid gap-6">
          {goals?.map((goal) => (
            <Card key={goal._id} className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-primary">
                      {goal.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {goal.category} • Due {format(new Date(goal.targetDate), "PP")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(goal._id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex gap-2 mt-4">
                    <Input
                      type="number"
                      placeholder="Add amount"
                      className="w-32"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const amount = parseFloat(e.target.value) + goal.currentAmount;
                          updateGoalProgress.mutate({ id: goal._id, amount });
                          e.target.value = '';
                        }
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Press Enter to add to current amount
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
