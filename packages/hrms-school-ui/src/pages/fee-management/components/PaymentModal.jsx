import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import '../../../assets/scss/PaymentModal.scss'

Modal.setAppElement('#root')

const PaymentModal = ({
  isOpen,
  onClose,
  feeType = 'Hostel Fee',
  amount = 10000
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [form, setForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [isOpen])

  const handleChange = (field, value) => {
    let formatted = value

    if (field === 'cardNumber') {
      formatted = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim()
    }

    if (field === 'expiryDate') {
      formatted = value
        .replace(/\D/g, '')
        .slice(0, 4)

      if (formatted.length > 2) {
        formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`
      }
    }

    if (field === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 3)
    }

    setForm(prev => ({ ...prev, [field]: formatted }))
  }

  const isCardValid =
    paymentMethod !== 'card' ||
    (form.cardNumber.replace(/\s/g, '').length === 16 &&
      form.expiryDate.length === 5 &&
      form.cvv.length === 3)

  const handlePayment = () => {
    if (!isCardValid) {
      setShowWarning(true)
      return
    }

    setShowWarning(false)

    console.log({
      paymentMethod,
      amount,
      feeType,
      ...form
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="school-payment-modal-content"
      overlayClassName="school-payment-modal-overlay"
      style={{ content: {}, overlay: {} }}
    >
      <button
        className="school-payment-modal-close"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="school-payment-modal-header">
        <h2 className="school-payment-modal-title">Make Payment</h2>
        <p className="school-payment-modal-subtitle">Complete your {feeType} payment securely</p>
      </div>

      <div className="school-payment-modal-body">
        <div className="school-payment-fee-summary">
          <div className="school-payment-fee-row">
            <span className="school-payment-fee-label">Fee Type</span>
            <span className="school-payment-fee-value">{feeType}</span>
          </div>
          <div className="school-payment-fee-row">
            <span className="school-payment-fee-label">Amount</span>
            <span className="school-payment-fee-amount">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="school-payment-method-section">
          <p className="school-payment-section-title">Payment Method</p>
          <div className="school-payment-methods">
            {['card', 'upi', 'netbanking'].map(method => (
              <button
                key={method}
                className={`school-payment-method-option ${
                  paymentMethod === method ? 'active' : ''
                }`}
                onClick={() => setPaymentMethod(method)}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="school-payment-card-details">
            {showWarning && (
              <div className="school-payment-warning">
                Please fill valid card details
              </div>
            )}
            <div className="school-payment-form-group">
              <label className="school-payment-form-label">Card Number</label>
              <input
                className="school-payment-form-input"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={e => handleChange('cardNumber', e.target.value)}
              />
            </div>
            <div className="school-payment-form-row">
              <div className="school-payment-form-group">
                <label className="school-payment-form-label">Expiry</label>
                <input
                  className="school-payment-form-input"
                  type="text"
                  placeholder="MM/YY"
                  value={form.expiryDate}
                  onChange={e => handleChange('expiryDate', e.target.value)}
                />
              </div>
              <div className="school-payment-form-group">
                <label className="school-payment-form-label">CVV</label>
                <input
                  className="school-payment-form-input"
                  type="text"
                  placeholder="CVV"
                  value={form.cvv}
                  onChange={e => handleChange('cvv', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="school-payment-security-message">
          <p>Your payment information is encrypted and secure.</p>
        </div>
      </div>

      <div className="school-payment-modal-footer">
        <button
          className="school-payment-button school-payment-button-cancel"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="school-payment-button school-payment-button-primary"
          onClick={handlePayment}
        >
          Pay ₹{amount.toLocaleString('en-IN')}
        </button>
      </div>
    </Modal>
  )
}

export default PaymentModal