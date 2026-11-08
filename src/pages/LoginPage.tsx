import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import type { LoginFormValues } from '../types/user'
import { getFromPath } from '../utils/routerState'

type LoginErrors = Partial<Record<keyof LoginFormValues, string>>

function validate(values: LoginFormValues): LoginErrors {
  const errors: LoginErrors = {}
  if (values.username.trim() === '') errors.username = 'Username is required'
  if (values.password === '') errors.password = 'Password is required'
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = getFromPath(location.state) ?? '/'

  // Controlled form: the inputs show whatever is in state.
  const [values, setValues] = useState<LoginFormValues>({ username: '', password: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormValues, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(values)

  function handleChange(field: keyof LoginFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }))
  }

  // An error is shown after the field was left (blur) or after the first submit attempt.
  function visibleError(field: keyof LoginFormValues): string | undefined {
    return submitted || touched[field] ? errors[field] : undefined
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // no page reload
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return

    login(values.username.trim()) // only the username is kept, never the password
    navigate(redirectTo, { replace: true })
  }

  // Someone who is already logged in has no reason to see the form.
  if (isLoggedIn) return <Navigate to={redirectTo} replace />

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Log in</h1>
        <p className="mt-2 text-sm text-muted">
          This is a demo store: any username and a password of at least 6 characters will do.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <TextField
            id="login-username"
            name="username"
            label="Username"
            autoComplete="username"
            value={values.username}
            onChange={(event) => handleChange('username', event.target.value)}
            onBlur={() => setTouched((previous) => ({ ...previous, username: true }))}
            error={visibleError('username')}
          />
          <TextField
            id="login-password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => handleChange('password', event.target.value)}
            onBlur={() => setTouched((previous) => ({ ...previous, password: true }))}
            error={visibleError('password')}
          />
          <Button type="submit" size="lg" className="w-full">
            Log In
          </Button>
        </form>
      </div>

      <Link
        to="/"
        className="mt-4 inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand"
      >
        ← Back to catalog
      </Link>
    </section>
  )
}
