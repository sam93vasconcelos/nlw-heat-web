import { useEffect } from 'react'
import { VscGithubInverted } from 'react-icons/vsc'
import { api } from '../../services/api'

import styles from './styles.module.scss'

type AuthResponse = {
  token: string
  user: {
    id: string
    avatar_url: string
    name: string
    login: string
  }
}

export function LoginBox() {
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=5bc5c8cbd64679e5d4bb`

  async function signIn(githubCode: string) {
    const { data } = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })

    const { token, user } = data;

    localStorage.setItem('@dowhile:token', token)

    console.log(user);
  }

  useEffect(() => {
    const url = window.location.href
    const hasGitHubCode = url.includes('?code=')

    if(hasGitHubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')

      window.history.pushState({}, '', urlWithoutCode)

      signIn(githubCode)
    }
  }, [])

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size="24" />
        Entrar com Github
      </a>
    </div>
  )
}