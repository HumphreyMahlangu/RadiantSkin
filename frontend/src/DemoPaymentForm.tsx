import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

type Field = 'cardholder' | 'cardNumber' | 'expiry' | 'securityCode'
type Details = Record<Field, string>

const approvedCard = '0000000000000000'
const declinedCard = '0000000000000002'
const empty: Details = { cardholder: '', cardNumber: '', expiry: '', securityCode: '' }
const fields: Field[] = ['cardholder', 'cardNumber', 'expiry', 'securityCode']

function validate(details: Details): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (!details.cardholder.trim()) errors.cardholder = 'Enter a fictional name.'
  const card = details.cardNumber.replace(/\s/g, '')
  if (card !== approvedCard && card !== declinedCard)
    errors.cardNumber = 'Use one of the demo card numbers shown above.'
  if (details.expiry.trim() !== '12/30') errors.expiry = 'Use the demo expiry date 12/30.'
  if (details.securityCode.trim() !== '123') errors.securityCode = 'Use the demo security code 123.'
  return errors
}

export default function DemoPaymentForm({ onApproved }: { onApproved: (reference: string) => void }) {
  const [details, setDetails] = useState<Details>(empty)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [attempted, setAttempted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [declined, setDeclined] = useState(false)
  const declineRef = useRef<HTMLDivElement>(null)
  const errors = validate(details)

  useEffect(() => {
    if (declined) declineRef.current?.focus()
  }, [declined])

  function change(event: ChangeEvent<HTMLInputElement>) {
    const field = event.currentTarget.name as Field
    const value = event.currentTarget.value
    setDetails((current) => ({ ...current, [field]: value }))
    if (declined) setDeclined(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (processing) return
    setAttempted(true)
    setDeclined(false)
    const firstError = fields.find((field) => errors[field])
    if (firstError) {
      document.getElementById(firstError)?.focus()
      return
    }

    setProcessing(true)
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    if (details.cardNumber.replace(/\s/g, '') === declinedCard) {
      setDeclined(true)
      setProcessing(false)
      return
    }

    setDetails(empty)
    onApproved(`DEMO-${Date.now().toString(36).toUpperCase()}`)
  }

  return (
    <section className="demo-payment" aria-labelledby="demo-payment-heading">
      <span className="eyebrow">03 / Demo payment</span>
      <h3 id="demo-payment-heading">Try a test card.</h3>
      <p className="demo-payment-intro">
        This is a simulation. Enter only these fictional values; no card details are sent or saved.
      </p>
      <div className="demo-card-hint">
        <p><strong>Approve:</strong> 0000 0000 0000 0000</p>
        <p><strong>Decline:</strong> 0000 0000 0000 0002</p>
        <p><strong>Expiry:</strong> 12/30 <span aria-hidden="true">·</span> <strong>Security code:</strong> 123</p>
      </div>
      {declined && (
        <div className="account-alert" role="alert" tabIndex={-1} ref={declineRef}>
          The demo payment was declined. Try the approval card shown above.
        </div>
      )}
      <form onSubmit={submit} autoComplete="off" noValidate>
        <div className="demo-payment-fields">
          {([
            ['cardholder', 'Name on demo card', 'text', 'text'],
            ['cardNumber', 'Demo card number', 'text', 'numeric'],
            ['expiry', 'Demo expiry date', 'text', 'numeric'],
            ['securityCode', 'Demo security code', 'password', 'numeric'],
          ] as const).map(([field, label, type, inputMode]) => {
            const error = (touched[field] || attempted) && errors[field]
            return (
              <div className={`demo-payment-field ${field === 'cardholder' || field === 'cardNumber' ? 'wide' : ''}`} key={field}>
                <label htmlFor={field}>{label}</label>
                <input
                  id={field}
                  name={field}
                  type={type}
                  inputMode={inputMode}
                  autoComplete="off"
                  value={details[field]}
                  onChange={change}
                  onBlur={() => setTouched((current) => ({ ...current, [field]: true }))}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${field}-error` : undefined}
                  maxLength={field === 'cardNumber' ? 19 : field === 'expiry' ? 5 : field === 'securityCode' ? 3 : 80}
                  required
                />
                {error && <span className="account-field-error" id={`${field}-error`}>{errors[field]}</span>}
              </div>
            )
          })}
        </div>
        <button className="button demo-payment-submit" type="submit" disabled={processing}>
          {processing ? 'Checking demo payment…' : 'Complete demo checkout'}
        </button>
      </form>
    </section>
  )
}
