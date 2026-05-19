import { useState } from 'react'

export default function AddMedicine({ onAdded }) {
  const [form, setForm] = useState({ fullName: '', brand: '', expiryDate: '', quantity: '', price: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price)
      })
    })
    setSubmitting(false)
    if (res.ok) {
      alert('✅ Medicine added successfully!')
      onAdded()
    } else {
      alert('❌ Failed to add medicine.')
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Add New Medicine</h2>
      <input name="fullName" placeholder="Medicine Name *" value={form.fullName} onChange={handleChange} required />
      <input name="brand" placeholder="Brand *" value={form.brand} onChange={handleChange} required />
      <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required />
      <input name="quantity" type="number" min="1" placeholder="Quantity *" value={form.quantity} onChange={handleChange} required />
      <input name="price" type="number" step="0.01" min="0" placeholder="Price (₹) *" value={form.price} onChange={handleChange} required />
      <textarea name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} />
      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Medicine'}
      </button>
    </form>
  )
}
