import React from "react";
import { Task, useTaskModel } from "../model/task-model";
import TasksView from "../view/tasks-view";
import TaskApiService, {
  TaskApiServiceMock,
} from "../services/task-api-service";

type Props = { tasks: Task[] };

const taskApiService = new TaskApiService();

export default function Tasks(props: Props) {
  const modelData = useTaskModel({ tasks: props.tasks, taskApiService });

  return <TasksView {...modelData} />;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getServerSideProps = async () => {
  const response = await fetch(`${API_URL}/api/tasks/`);
  const tasks = await response.json();

  return {
    props: { tasks },
  };
};
