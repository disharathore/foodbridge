import { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';

export default function Receiver() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const base = process.env.REACT_APP_SERVER_URL;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/listings?city=${state.city}&limit=50`);
      const data = await res.json();
      dispatch({ type:'SET_LISTINGS', payload: Array.isArray(data.listings) ? data.listings : [] });
    } catch {
      dispatch({ type:'SET_LISTINGS', payload:[] });
    } finally {
      setLoading(false);
    }
  }, [state.city, base]);

  useEffect(() => { fetchListings(); }, [state.city]);

  const listings = Array.isArray(state.listings) ? state.listings : [];
  const filtered = listings
    .filter(l => filter==='all' || l.foodType===filter)
    .filter(l => !search || l.restaurantName?.toLowerCase().includes(search.toLowerCase()) || l.location?.address?.toLowerCase().includes(search.toLowerCase()));

  const FILTERS = [
    {v:'all',l:'All food'},{v:'main_course',l:'🍛 Main'},{v:'bread',l:'🍞 Bread'},
    {v:'dessert',l:'🎂 Desserts'},{v:'salad',l:'🥗 Salads'},{v:'beverage',l:'🥤 Drinks'},
  ];

  return (
    <div style={{maxWidth:900,margin:'40px auto',padding:'0 24px'}}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:600,color:'#e8330a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:8}}>Feeding India · NGO Portal</div>
        <h1 style={{fontSize:28,fontWeight:800,color:'#111827',marginBottom:8}}>Claim surplus food</h1>
        <p style={{fontSize:15,color:'#6b7280'}}>Available listings in <strong>{state.city}</strong> · updated live via WebSocket</p>
      </div>

      {state.user?.role==='donor' && (
        <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:12,padding:'14px 20px',marginBottom:24,fontSize:14,color:'#92400e'}}>
          ⚠️ You're logged in as a <strong>donor</strong>. Switch to an NGO or volunteer account to claim food.
        </div>
      )}

      {/* Controls */}
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
        <input className="form-input" placeholder="🔍 Search by restaurant or area..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:200,padding:'9px 14px'}} />
        <select className="form-input form-select" value={state.city}
          onChange={e=>dispatch({type:'SET_CITY',payload:e.target.value})} style={{width:'auto',minWidth:150,padding:'9px 36px 9px 14px'}}>
          {['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune'].map(c=><option key={c}>{c}</option>)}
        </select>
        <button onClick={fetchListings} style={{padding:'9px 16px',background:'#fff',border:'1px solid #e5e7eb',borderRadius:8,fontSize:13,cursor:'pointer',fontFamily:'var(--font)'}}>
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>
        {FILTERS.map(f=>(
          <button key={f.v} onClick={()=>setFilter(f.v)} style={{
            padding:'6px 14px',borderRadius:20,border:`1px solid ${filter===f.v?'#e8330a':'#e5e7eb'}`,
            background:filter===f.v?'#fff1ee':'#fff',color:filter===f.v?'#e8330a':'#374151',
            fontSize:12,fontWeight:filter===f.v?600:400,cursor:'pointer',fontFamily:'var(--font)',
          }}>{f.l}</button>
        ))}
        <span style={{marginLeft:'auto',fontSize:13,color:'#9ca3af',alignSelf:'center'}}>{filtered.length} listings</span>
      </div>

      {loading ? (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>{[1,2,3,4].map(i=><SkeletonCard key={i}/>)}</div>
      ) : filtered.length===0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No listings found</div>
          <div className="empty-desc">{search ? 'Try a different search term.' : `No active surplus in ${state.city} right now.`}</div>
        </div></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {filtered.map(l=><ListingCard key={l._id} listing={l}/>)}
        </div>
      )}

      {/* How to claim */}
      <div className="card" style={{marginTop:32,background:'#f0fdf4',border:'1px solid #bbf7d0'}}>
        <div style={{fontWeight:700,fontSize:15,color:'#15803d',marginBottom:12}}>🤝 How claiming works</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,fontSize:13,color:'#374151'}}>
          {[
            {i:'1️⃣',t:'Click "Claim →" on any available listing'},
            {i:'2️⃣',t:'You get donor contact to coordinate pickup'},
            {i:'3️⃣',t:'Mark as delivered once food reaches shelter'},
          ].map(s=>(
            <div key={s.i} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
              <span style={{fontSize:16,flexShrink:0}}>{s.i}</span>
              <span style={{lineHeight:1.5}}>{s.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
