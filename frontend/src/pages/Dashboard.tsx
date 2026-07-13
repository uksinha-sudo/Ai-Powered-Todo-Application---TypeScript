import { useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL_TASK } from "../config";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardFooter } from "../components/ui/GlassCard";
import { GlassButton } from "../components/ui/GlassButton";
import { TodoList, TodoForm, TodoStats } from "../components/todo/TodoComponents";
import { NavbarWrapper } from "../components/ui/GlassNavbar";
import { Plus, CheckCircle, Clock, Sparkles, RotateCcw } from "lucide-react";

interface Task {
  _id: string;
  task: string;
  completion: boolean;
}

interface User {
  name: string;
  email: string;
}

export const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${BACKEND_URL_TASK}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.allTaks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${BACKEND_URL_TASK.replace("/todo", "/user")}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const handleAddTask = async (taskText: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsAdding(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL_TASK}/create`,
        { task: taskText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Task added!");
      fetchTasks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add task");
      } else {
        toast.error("Failed to add task");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `${BACKEND_URL_TASK}/update/${id}`,
        { completion: completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, completion: completed } : task))
      );
      toast.info(completed ? "Task completed!" : "Task marked as pending");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update task");
      } else {
        toast.error("Failed to update task");
      }
      fetchTasks();
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${BACKEND_URL_TASK}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.info("Task deleted");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete task");
      } else {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast.info("Logged out");
    window.location.href = "/signin";
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTasks();
      await fetchUser();
    };
    loadData();
  }, []);

  const completedCount = tasks.filter((t) => t.completion).length;
  const pendingCount = tasks.filter((t) => !t.completion).length;

  return (
    <NavbarWrapper user={user} onSignOut={handleSignOut}>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <motion.h1
                className="text-2xl sm:text-3xl font-bold text-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}!
              </motion.h1>
              <motion.p
                className="text-text-muted mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                You have <span className="font-medium text-text">{pendingCount}</span> task{pendingCount !== 1 ? "s" : ""} pending
              </motion.p>
            </div>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassButton
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                onClick={fetchTasks}
                disabled={isLoading}
              >
                Refresh
              </GlassButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TodoStats total={tasks.length} completed={completedCount} pending={pendingCount} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="elevated" padding="none">
              <GlassCardHeader
                title="Add New Task"
                subtitle="What needs to be done?"
                action={
                  <span className="text-sm text-text-muted">
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
                  </span>
                }
              />
              <GlassCardContent className="p-6">
                <TodoForm onAdd={handleAddTask} loading={isAdding} />
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard variant="elevated" padding="none">
              <GlassCardHeader
                title="Your Tasks"
                subtitle={tasks.length > 0 ? `${tasks.length} task${tasks.length !== 1 ? "s" : ""}` : "No tasks yet"}
              />
              <GlassCardContent className="p-6 pt-0">
                <TodoList
                  todos={tasks.map((t) => ({ id: t._id, text: t.task, completed: t.completion }))}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  emptyMessage="No tasks yet. Add one above to get started!"
                  emptyAction={
                    <GlassButton variant="ghost" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                      Add your first task
                    </GlassButton>
                  }
                  isLoading={isLoading}
                />
              </GlassCardContent>
              {tasks.length > 0 && (
                <GlassCardFooter divided>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {completedCount} completed
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-warning" />
                      {pendingCount} pending
                    </span>
                  </div>
                </GlassCardFooter>
              )}
            </GlassCard>
          </motion.div>

          {tasks.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard variant="bordered" padding="lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-success/10 text-success">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Completed</p>
                    <p className="text-2xl font-bold text-text">{completedCount}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard variant="bordered" padding="lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-warning/10 text-warning">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Pending</p>
                    <p className="text-2xl font-bold text-text">{pendingCount}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard variant="bordered" padding="lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Total</p>
                    <p className="text-2xl font-bold text-text">{tasks.length}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          <motion.div
            className="text-center text-text-subtle text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>AI Todo App &copy; {new Date().getFullYear()}</p>
          </motion.div>
        </motion.div>
      </main>
    </NavbarWrapper>
  );
};

export default Dashboard;