import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';

const FOOD_TYPES = [
  { v: 'main_course', emoji: '🍛', label: 'Main course', desc: 'Rice, curry, biryani' },
  { v: 'bread',       emoji: '🍞', label: 'Bread/bakery', desc: 'Roti, naan, bread' },
  { v: 'dessert',     emoji: '🎂', label: 'Desserts',     desc: 'Sweets, mithai, cake' },
  { v: 'salad',       emoji: '🥗', label: 'Salads',       desc: 'Salads, soups, snacks' },
  { v: 'beverage',    emoji: '🥤', label: 'Beverages',    desc: 'Juice, chai, drinks' },
  { v: 'other',       emoji: '🍱', label: 'Other',        desc: 'Mixed / uncategorised' },
];

const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad'];

export default function Donor() {
  const { emit } = useApp();
  const { authHeaders } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ restaurantName:'', foodType:'', description:'', portions:'', address:'', city:'Delhi', expiresInHours:2 });
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (k, v) => { setForm(f=>({...f,[k]:v})); setFieldErrors(e=>({...e,[k]:''})); };

  const validateStep = (s) => {
    const e = {};
    if (s===1) { if (!form.restaurantName.trim()) e.restaurantName='Required'; if (!form.foodType) e.foodType='Select a food type'; }
    if (s===2) { if (!form.portions || parseInt(form.portions)<1) e.portions='Enter valid number'; }
    if (s===3) { if (!form.address.trim()) e.address='Address is required'; }
    setFieldErrors(e);
    return Object.keys(e).length===0;
  };

  const next = (s) => { if (validateStep(s)) setStep(s+1); };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    const toastId = toast.loading('Posting your listing...');
    try {
      const expiresAt = new Date(Date.now() + form.expiresInHours * 3600000);
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/listings`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          restaurantName: form.restaurantName,
          foodType: form.foodType,
          description: form.description,
          portions: parseInt(form.portions),
          expiresAt,
          location: { type:'Point', coordinates:[77.2090,28.6139], address:form.address, city:form.city },
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to post', { id:toastId }); return; }
      emit('listing:new', { ...data, city:form.city });
      toast.success(`🎉 ${form.portions} meals listed successfully!`, { id:toastId });
      setSubmitted(data);
    } catch {
      toast.error('Network error. Check backend is running.', { id:toastId });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div style={{ minHeight:'65vh', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
      <div style={{ textAlign:'center', maxWidth:420 }}>
        <div style={{ fontSize:72, marginBottom:20 }}>🎉</div>
        <h2 style={{ fontSize:28, fontWeight:800, color:'#111827', marginBottom:12 }}>Food posted successfully!</h2>
        <p style={{ fontSize:15, color:'#6b7280', lineHeight:1.7, marginBottom:24 }}>
          <strong style={{ color:'#16a34a' }}>{form.portions} meals</strong> from <strong>{form.restaurantName}</strong> are now live.
          NGOs in {form.city} have been notified in real time.
        </p>
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'16px 24px', marginBottom:24, fontSize:14, color:'#16a34a', fontWeight:500 }}>
          🌿 Estimated CO₂ offset: <strong>{Math.round(parseInt(form.portions)*0.25)} kg</strong>
        </div>
        <button className="btn-primary" style={{ width:'100%' }} onClick={() => { setSubmitted(null); setStep(1); setForm({ restaurantName:'',foodType:'',description:'',portions:'',address:'',city:'Delhi',expiresInHours:2 }); }}>
          + Post another listing
        </button>
      </div>
    </div>
  );

  const selectedFood = FOOD_TYPES.find(f=>f.v===form.foodType);

  return (
    <div style={{ maxWidth:600, margin:'40px auto', padding:'0 24px' }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:600, color:'#e8330a', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>Feeding India · Donate</div>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#111827', marginBottom:8 }}>Post surplus food</h1>
        <p style={{ fontSize:15, color:'#6b7280', lineHeight:1.6 }}>Help rescue food before it goes to waste. Takes 60 seconds.</p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          {['Food details','Quantity & time','Location'].map((s,i) => (
            <div key={s} style={{ flex:1 }}>
              <div className="progress-bar"><div className="progress-fill" style={{ width: step > i ? '100%' : step === i+1 ? '50%' : '0%' }} /></div>
              <div style={{ fontSize:11, color: step > i ? '#e8330a' : '#9ca3af', fontWeight: step > i ? 600 : 400, marginTop:4 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-lg">
        {/* Step 1 */}
        {step===1 && <>
          <div className="form-group">
            <label className="form-label">Restaurant / organization name *</label>
            <input className={`form-input ${fieldErrors.restaurantName?'error':''}`} placeholder="e.g. Biryani House, Hotel Leela" value={form.restaurantName} onChange={e=>set('restaurantName',e.target.value)} />
            {fieldErrors.restaurantName && <div style={{color:'#dc2626',fontSize:12,marginTop:4}}>{fieldErrors.restaurantName}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Type of food * {fieldErrors.foodType && <span style={{color:'#dc2626',fontWeight:400,marginLeft:8}}>{fieldErrors.foodType}</span>}</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              {FOOD_TYPES.map(ft => (
                <div key={ft.v} onClick={()=>set('foodType',ft.v)} style={{
                  padding:'14px', borderRadius:10, cursor:'pointer',
                  border:`2px solid ${form.foodType===ft.v?'#e8330a':'#e5e7eb'}`,
                  background:form.foodType===ft.v?'#fff1ee':'#fff', transition:'all 0.15s',
                  display:'flex', alignItems:'center', gap:10,
                }}>
                  <span style={{fontSize:24}}>{ft.emoji}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:form.foodType===ft.v?'#e8330a':'#374151'}}>{ft.label}</div>
                    <div style={{fontSize:11,color:'#9ca3af'}}>{ft.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description <span style={{color:'#9ca3af',fontWeight:400}}>(optional)</span></label>
            <input className="form-input" placeholder="e.g. Dal makhani, rice, salad, roti" value={form.description} onChange={e=>set('description',e.target.value)} />
          </div>
          <button className="form-btn" onClick={()=>next(1)}>Next: Quantity →</button>
        </>}

        {/* Step 2 */}
        {step===2 && <>
          <div className="form-group">
            <label className="form-label">Number of meal portions *</label>
            <input className={`form-input ${fieldErrors.portions?'error':''}`} type="number" min="1" max="10000" placeholder="e.g. 80" value={form.portions} onChange={e=>set('portions',e.target.value)}
              style={{fontSize:28,fontWeight:800,textAlign:'center',padding:'16px'}} />
            {fieldErrors.portions && <div style={{color:'#dc2626',fontSize:12,marginTop:4}}>{fieldErrors.portions}</div>}
            {form.portions && parseInt(form.portions)>0 && (
              <div style={{marginTop:10,fontSize:13,color:'#16a34a',fontWeight:500,background:'#f0fdf4',padding:'8px 14px',borderRadius:8}}>
                🌿 Estimated CO₂ offset: ~{Math.round(parseInt(form.portions)*0.25)} kg
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" style={{display:'flex',justifyContent:'space-between'}}>
              Available for: <strong style={{color:'#e8330a'}}>{form.expiresInHours} hour{form.expiresInHours>1?'s':''}</strong>
            </label>
            <input type="range" min="1" max="8" step="1" value={form.expiresInHours} onChange={e=>set('expiresInHours',parseInt(e.target.value))} style={{width:'100%',accentColor:'#e8330a'}} />
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#9ca3af',marginTop:4}}>
              <span>1 hour</span><span>4 hours</span><span>8 hours</span>
            </div>
          </div>
          <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:10,padding:'12px 16px',marginBottom:20,fontSize:13,color:'#92400e'}}>
            ⏰ Expires at: {new Date(Date.now()+form.expiresInHours*3600000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn-secondary" style={{flex:1,padding:'13px',fontFamily:'var(--font)'}} onClick={()=>setStep(1)}>← Back</button>
            <button className="form-btn" style={{flex:2}} onClick={()=>next(2)}>Next: Location →</button>
          </div>
        </>}

        {/* Step 3 */}
        {step===3 && <>
          <div className="form-group">
            <label className="form-label">Pickup address *</label>
            <input className={`form-input ${fieldErrors.address?'error':''}`} placeholder="e.g. 14 Janpath, Connaught Place, New Delhi" value={form.address} onChange={e=>set('address',e.target.value)} />
            {fieldErrors.address && <div style={{color:'#dc2626',fontSize:12,marginTop:4}}>{fieldErrors.address}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <select className="form-input form-select" value={form.city} onChange={e=>set('city',e.target.value)}>
              {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Summary */}
          <div style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:10,padding:'16px',marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:600,color:'#6b7280',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>Summary</div>
            {[
              ['From', form.restaurantName],
              ['Food', `${selectedFood?.emoji||''} ${selectedFood?.label||''}`],
              ['Portions', `${form.portions} meals`],
              ['Available for', `${form.expiresInHours} hours`],
              ['City', form.city],
            ].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'6px 0',borderBottom:'1px solid #f3f4f6'}}>
                <span style={{color:'#9ca3af'}}>{k}</span>
                <span style={{fontWeight:600,color:'#111827'}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn-secondary" style={{flex:1,padding:'13px',fontFamily:'var(--font)'}} onClick={()=>setStep(2)}>← Back</button>
            <button className="form-btn" style={{flex:2}} onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Posting...' : '🚀 Post listing'}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}
