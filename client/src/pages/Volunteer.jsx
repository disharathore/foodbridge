import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function Volunteer() {
  const { authHeaders } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const base = process.env.REACT_APP_SERVER_URL;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [claimed, transit] = await Promise.all([
        fetch(`${base}/api/listings?status=claimed&limit=20`).then(r=>r.json()),
        fetch(`${base}/api/listings?status=in_transit&limit=20`).then(r=>r.json()),
      ]);
      const all = [
        ...(claimed.listings||[]),
        ...(transit.listings||[]),
      ];
      setListings(all);
    } catch { setListings([]); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchAll(); },[]);

  const updateStatus = async (id, status, label) => {
    const toastId = toast.loading(`Marking as ${label}...`);
    try {
      const res = await fetch(`${base}/api/listings/${id}/status`, {
        method:'PATCH', headers:authHeaders(), body:JSON.stringify({status}),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error, {id:toastId}); return; }
      toast.success(`✅ ${label} confirmed!`, {id:toastId});
      fetchAll();
    } catch { toast.error('Network error', {id:toastId}); }
  };

  const STEPS = {
    claimed:    { icon:'📦', label:'Claimed — ready for pickup', next:'in_transit', nextLabel:'Mark picked up', nextColor:'#2563eb' },
    in_transit: { icon:'🚗', label:'In transit — on the way',   next:'delivered',  nextLabel:'Mark delivered', nextColor:'#16a34a' },
  };

  return (
    <div style={{maxWidth:720,margin:'40px auto',padding:'0 24px'}}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:600,color:'#e8330a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:8}}>Feeding India · Volunteer Portal</div>
        <h1 style={{fontSize:28,fontWeight:800,color:'#111827',marginBottom:8}}>Pickup & delivery tracker</h1>
        <p style={{fontSize:15,color:'#6b7280'}}>Manage your active pickups and confirm deliveries.</p>
      </div>

      <button onClick={fetchAll} style={{marginBottom:20,padding:'8px 16px',background:'#fff',border:'1px solid #e5e7eb',borderRadius:8,fontSize:13,cursor:'pointer',fontFamily:'var(--font)'}}>
        🔄 Refresh
      </button>

      {loading ? (
        <div style={{textAlign:'center',padding:60,color:'#9ca3af'}}>Loading active pickups...</div>
      ) : listings.length===0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-icon">🚗</div>
          <div className="empty-title">No active pickups</div>
          <div className="empty-desc">Listings that have been claimed will appear here for pickup.</div>
        </div></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {listings.map(l=>{
            const step = STEPS[l.status];
            if (!step) return null;
            return (
              <div key={l._id} className="card" style={{border:`1px solid ${l.status==='in_transit'?'#bfdbfe':'#e5e7eb'}`}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:14}}>
                  <div style={{fontSize:32}}>{step.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:15,color:'#111827'}}>{l.restaurantName}</div>
                    <div style={{fontSize:13,color:'#6b7280',marginTop:3}}>
                      📍 {l.location?.address || l.location?.city} · {l.portions} meals · {l.foodType?.replace('_',' ')}
                    </div>
                    {l.description && <div style={{fontSize:12,color:'#9ca3af',marginTop:4,fontStyle:'italic'}}>"{l.description}"</div>}
                  </div>
                  <span className={`badge ${l.status==='in_transit'?'badge-blue':'badge-amber'}`}>{step.label}</span>
                </div>

                {/* Progress tracker */}
                <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:16}}>
                  {[
                    {label:'Posted',done:true},
                    {label:'Claimed',done:true},
                    {label:'Picked up',done:l.status==='in_transit'},
                    {label:'Delivered',done:false},
                  ].map((s,i,arr)=>(
                    <div key={s.label} style={{display:'flex',alignItems:'center',flex:i<arr.length-1?1:'auto'}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                        <div style={{width:24,height:24,borderRadius:'50%',background:s.done?'#16a34a':'#e5e7eb',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#fff',fontWeight:700}}>
                          {s.done?'✓':i+1}
                        </div>
                        <div style={{fontSize:10,color:s.done?'#16a34a':'#9ca3af',fontWeight:s.done?600:400,whiteSpace:'nowrap'}}>{s.label}</div>
                      </div>
                      {i<arr.length-1 && <div style={{flex:1,height:2,background:s.done?'#16a34a':'#e5e7eb',margin:'0 4px',marginBottom:18}}/>}
                    </div>
                  ))}
                </div>

                <button onClick={()=>updateStatus(l._id, step.next, step.nextLabel)}
                  style={{width:'100%',padding:'11px',background:step.nextColor,color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}}>
                  {step.nextLabel} →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
