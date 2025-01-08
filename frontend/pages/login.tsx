import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
import { useState } from 'react'


const Home: NextPage = () => {
  const [values, setValues] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:8000/api/token-auth/', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
      </Head>

      <main className={styles.main}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Email" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
