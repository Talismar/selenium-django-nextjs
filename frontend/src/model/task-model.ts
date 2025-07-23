import { useState } from "react";
import { CreateTaskBody, ITaskApiService } from "../services/task-api-service";

export type Task = {
  id: number;
  title: string;
  description: string;
};

type TaskModel = {
  taskApiService: ITaskApiService;
  tasks?: Task[];
};

export function useTaskModel({ taskApiService, ...params }: TaskModel) {
  const [tasks, setTasks] = useState<Task[]>(params?.tasks ?? []);

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  async function addTask(task: CreateTaskBody) {
    const newTask = await taskApiService.create(task);
    setTasks((prev) => [...prev, newTask]);
  }

  async function fetchTasks() {
    const tasks = await taskApiService.list();
    setTasks(tasks);
  }

  async function deleteTask(id: number) {
    await taskApiService.delete(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  async function updateTask(taskId: number, task: Partial<Task>) {
    const data = await taskApiService.update(taskId, task);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? data : t)));
  }

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
  };
}
