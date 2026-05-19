import { useEffect, useState } from 'react'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(data => { setSales(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const totalRevenue = sales.reduce((s, r) => s + (r.quantitySold * r.unitPriceAtSale), 0)
  const totalUnits = sales.reduce((s, r) => s + r.quantitySold, 0)

  if (loading) return <p style={{textAlign:'center',padding:40,color:'#999'}}>Loading...</p>

  return (
    <div>
      <div className="stats">
        <div className="stat-card"><div className="stat-value">{sales.length}</div><div>Total Sales</div></div>
        <div className="stat-card"><div className="stat-value">{totalUnits}</div><div>Units Sold</div></div>
        <div className="stat-card"><div className="stat-value">₹{totalRevenue.toFixed(2)}</div><div>Revenue</div></div>
      </div>

      <table className="table">
        <thead>
          <tr><th>Date</th><th>Medicine</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr><td colSpan={5} style={{textAlign:'center',padding:24,color:'#999'}}>No sales recorded yet</td></tr>
          ) : [...sales].reverse().map((s, i) => (
            <tr key={i}>
              <td>{new Date(s.saleDate).toLocaleString('en-IN', {dateStyle:'medium', timeStyle:'short'})}</td>
              <td>{s.medicineName}</td>
              <td>{s.quantitySold}</td>
              <td>₹{Number(s.unitPriceAtSale).toFixed(2)}</td>
              <td><strong>₹{(s.quantitySold * s.unitPriceAtSale).toFixed(2)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
