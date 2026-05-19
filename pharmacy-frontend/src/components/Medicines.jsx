import { useEffect, useState } from 'react'

const API = '/api'

export default function Medicines() {
  const [medicines, setMedicines] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saleModal, setSaleModal] = useState(null)
  const [saleQty, setSaleQty] = useState('')

  useEffect(() => { loadMedicines() }, [])

  async function loadMedicines() {
    setLoading(true)
    const url = search ? `${API}/medicines?search=${encodeURIComponent(search)}` : `${API}/medicines`
    const res = await fetch(url)
    const data = await res.json()
    setMedicines(data)
    setLoading(false)
  }

  async function deleteMedicine(id, name) {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`${API}/medicines/${id}`, { method: 'DELETE' })
    loadMedicines()
  }

  async function confirmSale() {
    const qty = parseInt(saleQty)
    if (!qty || qty <= 0 || qty > saleModal.quantity) return alert('Invalid quantity')
    await fetch(`${API}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicineId: saleModal.id, quantity: qty })
    })
    setSaleModal(null)
    setSaleQty('')
    loadMedicines()
  }

  function daysUntilExpiry(dateStr) {
    return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  }

  function getBadge(m) {
    const days = daysUntilExpiry(m.expiryDate)
    if (days <= 0) return <span className="badge badge-red">Expired</span>
    if (days < 30) return <span className="badge badge-red">Exp. in {days}d</span>
    if (m.quantity < 10) return <span className="badge badge-yellow">Low stock</span>
    return <span className="badge badge-green">OK</span>
  }

  return (
    <div>
      <div className="search-bar">
        <input
          placeholder="Search by medicine name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && loadMedicines()}
        />
        <button className="btn btn-primary" onClick={loadMedicines}>↻ Refresh</button>
      </div>

      <div className="legend">
        <span><span className="legend-dot" style={{background:'#fee2e2'}}></span> Expiring within 30 days</span>
        <span><span className="legend-dot" style={{background:'#fef9c3'}}></span> Low stock (qty &lt; 10)</span>
      </div>

      {loading ? <p style={{textAlign:'center',padding:40,color:'#999'}}>Loading...</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>Medicine Name</th><th>Brand</th><th>Expiry Date</th>
              <th>Qty in Stock</th><th>Price (₹)</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:24,color:'#999'}}>No medicines found</td></tr>
            ) : medicines.map(m => (
              <tr key={m.id}>
                <td><strong>{m.fullName}</strong></td>
                <td>{m.brand}</td>
                <td>{new Date(m.expiryDate).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</td>
                <td>{m.quantity}</td>
                <td>₹{Number(m.price).toFixed(2)}</td>
                <td>{getBadge(m)}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => { setSaleModal(m); setSaleQty('') }}>Sell</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={() => deleteMedicine(m.id, m.fullName)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {saleModal && (
        <div className="modal-backdrop" onClick={() => setSaleModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Record Sale</h3>
            <p><strong>{saleModal.fullName}</strong> — Available: {saleModal.quantity}</p>
            <input type="number" min="1" max={saleModal.quantity} placeholder="Quantity to sell" value={saleQty} onChange={e => setSaleQty(e.target.value)} />
            <div style={{marginTop:14, display:'flex', gap:8}}>
              <button className="btn btn-primary" onClick={confirmSale}>Confirm Sale</button>
              <button className="btn" style={{background:'#e5e5e5'}} onClick={() => setSaleModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
