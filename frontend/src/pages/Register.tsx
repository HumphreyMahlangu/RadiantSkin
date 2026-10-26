import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'

type Field = 'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'password' | 'confirmPassword'
type Values = Record<Field, string>

const empty: Values = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
}
const fields: Field[] = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'password',
  'confirmPassword',
]

function validate(values: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (!values.firstName.trim()) errors.firstName = 'Enter your first name.'
  if (!values.lastName.trim()) errors.lastName = 'Enter your last name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Enter a valid email address.'
  if (!values.phoneNumber.trim()) errors.phoneNumber = 'Enter your phone number.'
  if (values.password.length < 8) errors.password = 'Use at least 8 characters.'
  if (values.confirmPassword !== values.password)
    errors.confirmPassword = 'The passwords do not match.'
  else if (!values.confirmPassword) errors.confirmPassword = 'Confirm your password.'
  return errors
}

export default function RegisterPage() {
  const [values, setValues] = useState<Values>(empty)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [emailTaken, setEmailTaken] = useState(false)
  const [created, setCreated] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)
  const errors = validate(values)

  useEffect(() => {
    if (serverError) errorRef.current?.focus()
  }, [serverError])

  function change(event: ChangeEvent<HTMLInputElement>) {
    const field = event.currentTarget.name as Field
    const value = event.currentTarget.value
    setValues((current) => ({ ...current, [field]: value }))
    if (serverError) setServerError('')
    if (field === 'email') setEmailTaken(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setSubmitted(true)
    setServerError('')
    setEmailTaken(false)
    const firstError = fields.find((field) => errors[field])
    if (firstError) {
      document.getElementById(firstError)?.focus()
      return
    }

    setSubmitting(true)
    try {
      const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
      const response = await fetch(`${base}/customer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim().toLowerCase(),
          phoneNumber: values.phoneNumber.trim(),
          password: values.password,
        }),
      })
      if (!response.ok) {
        if (response.status === 400) {
          const message = await response.text()
          setServerError(
            message.includes('already registered')
              ? 'An account with this email already exists.'
              : 'Please check your details and try again.',
          )
          if (message.includes('already registered')) setEmailTaken(true)
        } else {
          setServerError('We could not create your account right now. Please try again.')
        }
        return
      }
      setValues(empty)
      setCreated(true)
    } catch {
      setServerError('We could not reach the store. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page section account-page">
      <div className="account-intro">
        <span className="eyebrow">Your everyday care</span>
        <h1>Create an account.</h1>
        <p>Keep your details ready for the RadiantSkin experiences ahead.</p>
        <a className="text-link" href="#account-form">
          Start with your details
        </a>
      </div>
      <div className="account-panel" id="account-form">
        {created ? (
          <div className="account-success" role="status">
            <span className="eyebrow">Welcome to RadiantSkin</span>
            <h2>Your account has been created.</h2>
            <p>Your account is ready. Log in to continue shopping.</p>
            <Link className="button" to="/login">
              Log in
            </Link>
          </div>
        ) : (
          <>
            <span className="eyebrow">Join RadiantSkin</span>
            <h2>Your details.</h2>
            <p className="account-panel-intro">All fields are required.</p>
            {serverError && (
              <div className="account-alert" role="alert" tabIndex={-1} ref={errorRef}>
                {serverError}
              </div>
            )}
            <form onSubmit={submit} noValidate>
              <div className="account-fields">
                {(
                  [
                    ['firstName', 'First name', 'given-name', 'text'],
                    ['lastName', 'Last name', 'family-name', 'text'],
                    ['email', 'Email address', 'email', 'email'],
                    ['phoneNumber', 'Phone number', 'tel', 'tel'],
                    ['password', 'Password', 'new-password', 'password'],
                    ['confirmPassword', 'Confirm password', 'new-password', 'password'],
                  ] as const
                ).map(([field, label, autocomplete, type]) => {
                  const errorMessage =
                    touched[field] || submitted
                      ? errors[field] ||
                        (field === 'email' && emailTaken
                          ? 'Use a different email address.'
                          : undefined)
                      : undefined
                  return (
                    <div className="account-field" key={field}>
                      <label htmlFor={field}>{label}</label>
                      <input
                        id={field}
                        name={field}
                        type={type}
                        autoComplete={autocomplete}
                        value={values[field]}
                        onChange={change}
                        onBlur={() => setTouched((current) => ({ ...current, [field]: true }))}
                        aria-invalid={Boolean(errorMessage)}
                        aria-describedby={
                          errorMessage
                            ? `${field}-error${field === 'password' ? ' password-hint' : ''}`
                            : field === 'password'
                              ? 'password-hint'
                              : undefined
                        }
                        required
                      />
                      {field === 'password' && (
                        <span className="account-hint" id="password-hint">
                          At least 8 characters.
                        </span>
                      )}
                      {errorMessage && (
                        <span className="account-field-error" id={`${field}-error`}>
                          {errorMessage}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              <button className="button account-submit" type="submit" disabled={submitting}>
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
            <p className="account-switch">
              Already have an account?{' '}
              <Link className="text-link" to="/login">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
