import React, { useState } from "react";
import { Task, useTaskModel } from "../model/task-model";

type TaskForm = {
  id?: number;
  title: string;
  description: string;
};

export default function TasksView(props: ReturnType<typeof useTaskModel>) {
  const [values, setValues] = useState<TaskForm>({
    title: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (values.id) {
      props.updateTask(values.id, values);
      return;
    }

    props.addTask(values);
  };

  return (
    <div>
      <h1>Lista de tarefas</h1>
      <ul>
        {props.tasks.map((item) => (
          <li key={item.id}>
            <p>{item.id}</p>
            <p>{item.title}</p>
            <p>{item.description}</p>
            <button onClick={() => setValues(item)}>Atualizar</button>
            <button onClick={() => props.deleteTask(item.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      <h1>Criar tarefa</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titulo"
          name="title"
          value={values.title}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Descrição"
          name="description"
          value={values.description}
          onChange={handleChange}
        />
        <button type="submit">{values.id ? "Atualizar" : "Criar"}</button>
      </form>
    </div>
  );
}
