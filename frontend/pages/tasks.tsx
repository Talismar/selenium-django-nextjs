import React, { useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
};

type TaskForm = {
  id?: number;
  title: string;
  description: string;
}

type Props = { tasks: Task[] }

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Tasks(props: Props) {
  const [tasks, setTasks] = useState<Task[]>(props.tasks);
  const [values, setValues] = useState<TaskForm>({
    title: '',
    description: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (values.id) {
      handleUpdate(values.id)
      return 
    }
    
    try {
      const response = await fetch(`${API_URL}/api/tasks/`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setTasks(prev => [...prev, data])
    } catch (error) {
      //
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        setTasks(prev => prev.filter(item => item.id !== id))
      }
    } catch (error) {
      //
    }
  }

  async function handleUpdate(id: number) {
    if (!values.id) return
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({
          title: values.title,
          description: values.description
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const responseJson = await response.json()
        setTasks(prev => prev.map(item => item.id === id ? responseJson : item))
      }
    } catch (error) {
      //
    }
  }

  return (
    <div>
      <h1>Lista de tarefas</h1>
      <ul>
        {tasks.map((item) => (
          <li key={item.id}>
            <p>{item.id}</p>
            <p>{item.title}</p>
            <p>{item.description}</p>
            <button onClick={() => setValues(item)}>Atualizar</button>
            <button onClick={() => handleDelete(item.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      
      <h1>Criar tarefa</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Titulo" name="title" value={values.title} onChange={handleChange}/>
        <input type="text" placeholder="Descrição" name="description" value={values.description} onChange={handleChange} />
        <button type="submit">{values.id ? 'Atualizar' : 'Criar'}</button>
      </form>
    </div>
  );
}


export const getServerSideProps = async () => {
  const response = await fetch(`${API_URL}/api/tasks/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseJson =  await response.json();

  return {
    props: {
      tasks: responseJson
    }
  }
}