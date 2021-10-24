import { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { api } from '../../services/api'

import styles from './styles.module.scss'

import logoImg from '../../assets/logo.svg'
import { AuthContext } from '../../contexts/auth'

type Message = {
  id: string
  text: string
  user: {
    name: string
    avatar_url: string
  }
}

const messagesQueue: Message[] = []

const socket = io('http://localhost:3333')

socket.on('new_message', newMessage => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])
  const { signOut, user } = useContext(AuthContext)

  useEffect(() => {
    const timer = setInterval(() => {
      if(messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1]
        ].filter(Boolean))

        messagesQueue.shift()
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<Message[]>('/messages/last3').then(res => {
      setMessages(res.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      {user ? <div className={styles.headerWrapper}>
        <button onClick={ signOut } className={styles.signOutButton}>
          Sair
        </button>

        <div className={styles.userImageHeader}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
      </div> : ''}

      <ul className={styles.messageList}>
        {messages.map(message => 
          <li key={message.id} className={styles.message}>
            <p className={styles.messageContent}>
              {message.text}
            </p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}