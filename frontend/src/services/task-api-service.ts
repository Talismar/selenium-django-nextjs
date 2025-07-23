import { Task } from "../model/task-model";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CreateTaskBody = Omit<Task, "id">;

export interface ITaskApiService {
  create(task: CreateTaskBody): Promise<Task>;
  list(): Promise<Task[]>;
  delete(taskId: number): Promise<void>;
  update(taskId: number, task: Partial<Task>): Promise<Task>;
}

class TaskApiService implements ITaskApiService {
  async list(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/api/tasks/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async create(task: CreateTaskBody): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks/`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async delete(taskId: number): Promise<void> {
    await fetch(`${API_URL}/api/tasks/${taskId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async update(taskId: number, task: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/`, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();
    return responseJson;
  }
}

export class TaskApiServiceMock implements ITaskApiService {
  tasks: Task[] = [];

  constructor() {
    this.tasks = [];
  }

  async list(): Promise<Task[]> {
    return this.tasks;
  }

  async create(task: CreateTaskBody): Promise<Task> {
    const newTask = { ...task, id: this.tasks.length + 1 };
    console.log(newTask);
    this.tasks.push(newTask);
    return newTask;
  }

  async delete(taskId: number): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  async update(taskId: number, task: Partial<Task>): Promise<Task> {
    const index = this.tasks.findIndex((task) => task.id === taskId);
    this.tasks[index] = { ...this.tasks[index], ...task };
    return this.tasks[index];
  }
}

export default TaskApiService;
