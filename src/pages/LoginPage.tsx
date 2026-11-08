import { useFormik } from 'formik'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import type { LoginFormValues } from '../types/user'
import { getFromPath } from '../utils/routerState'

// The validation rules live in one declarative schema; Formik runs it on change, blur and submit.
const loginSchema = Yup.object({
  username: Yup.string().trim().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = getFromPath(location.state) ?? '/'

  const formik = useFormik<LoginFormValues>({
    initialValues: { username: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login(values.username.trim()) // only the username is kept, never the password
      navigate(redirectTo, { replace: true })
    },
  })

  // Someone who is already logged in has no reason to see the form.
  if (isLoggedIn) return <Navigate to={redirectTo} replace />

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Log in</h1>
        <p className="mt-2 text-sm text-muted">
          This is a demo store: any username and a password of at least 6 characters will do.
        </p>

        <form onSubmit={formik.handleSubmit} noValidate className="mt-6 space-y-4">
          <TextField
            id="login-username"
            name="username"
            label="Username"
            autoComplete="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username ? formik.errors.username : undefined}
          />
          <TextField
            id="login-password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : undefined}
          />
          <Button type="submit" size="lg" className="w-full" disabled={formik.isSubmitting}>
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
