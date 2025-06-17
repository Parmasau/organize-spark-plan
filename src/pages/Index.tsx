
import { useState, useEffect } from "react";
import { Plus, CheckCircle, Circle, Trash2, Calendar, BarChart3, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "@/components/TaskCard";
import TaskStats from "@/components/TaskStats";
import AddTaskModal from "@/components/AddTaskModal";
import { Task } from "@/types/Task";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Task Master</h1>
          <p className="text-slate-600 text-lg">Organize your life, one task at a time</p>
        </div>

        {/* Stats Overview */}
        <TaskStats 
          totalTasks={tasks.length}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Task
                </Button>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Filter Tasks</h4>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilter('all')}
                      className="w-full justify-start"
                      size="sm"
                    >
                      All Tasks ({tasks.length})
                    </Button>
                    <Button
                      variant={filter === 'pending' ? 'default' : 'outline'}
                      onClick={() => setFilter('pending')}
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Pending ({pendingTasks})
                    </Button>
                    <Button
                      variant={filter === 'completed' ? 'default' : 'outline'}
                      onClick={() => setFilter('completed')}
                      className="w-full justify-start"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed ({completedTasks})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Task Area */}
          <div className="lg:col-span-3">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Your Tasks
                  </span>
                  <Badge variant="secondary">
                    {filteredTasks.length} tasks
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <Target className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-600 mb-2">
                      {filter === 'completed' ? 'No completed tasks yet' : 
                       filter === 'pending' ? 'No pending tasks' : 
                       'No tasks yet'}
                    </h3>
                    <p className="text-slate-500 mb-4">
                      {filter === 'all' ? 'Create your first task to get started!' : 
                       'Try changing the filter to see other tasks.'}
                    </p>
                    {filter === 'all' && (
                      <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Task
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTasks.map((task, index) => (
                      <div 
                        key={task.id} 
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <TaskCard
                          task={task}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addTask}
        />
      </div>
    </div>
  );
};

export default Index;
