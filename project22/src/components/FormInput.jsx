import React from 'react'
import './FormInput.css'

export default function FormInput({ label, hint, children }) {
  return (
    <label className="form-input-wrapper">
      <span className="form-input-label">{label}</span>
      {children}
      {hint && <span className="form-input-hint">{hint}</span>}
    </label>
  )
}