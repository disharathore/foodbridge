import { useEffect, useState } from 'react';

export default function Impact() {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const base = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    Promise.all([
      fetch(`${base}/api/listings/stats/summary`).then(r=>r.json()),
      fetch(`${base}/api/impact/weekly`).then(r=>r.json()),
      fetch(`${base}/api/impact/categories`).then(r=>r.json()),
    ]).then(([s, w, c]) => {
      if (!s.error) setStats(s);
      if (Array.isArray(w)) setWeekly(w);
      if (Array.isArray(c)) setCategories(c);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, [base]);

  const totalMeals = stats?.totalMealsSaved || 0;
  const todayMeals = stats?.mealsTodaySaved || 0;
  const co2        = stats?.co2Offset || 0;
  const active     = stats?.activeListings || 0;

  // Build 7-day chart data — merge real API data with day labels
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date();
  const chartData = Array.from({length:7}, (_,i) => {
    const d = new Date(today); d.setDate(today.getDate()-6+i);
    const dateStr = d.toISOString().split('T')[0];
    const found = weekly.find(w => w.date === dateStr);
    return { day: DAYS[d.getDay()], meals: found?.meals || 0, isToday: i===6 };
  });
  const maxMeals = Math.max(...chartData.map(d=>d.meals), 1);

  const FOOD_LABELS = { main_course:'🍛 Main course', bread:'🍞 Bread', dessert:'🎂 Desserts', salad:'🥗 Salads', beverage:'🥤 Beverages', other:'🍱 Other' };
  const totalCatMeals = categories.reduce((s,c)=>s+c.meals,0) || 1;

  const METRICS = [
    { icon:'🍽️', label:'Total meals rescued',  value: totalMeals.toLocaleString(),  color:'#e8330a' },
    { icon:'📦', label:'Meals rescued today',   value: todayMeals.toLocaleString(),  color:'#2563eb' },
    { icon:'🌿', label:'CO₂ offset (kg)',        value: co2.toLocaleString(),         color:'#16a34a' },
    { icon:'🔥', label:'Active listings now',    value: active,                       color:'#d97706' },
  ];

  const ENV = [
    { icon:'🌳', label:'Trees equivalent',      value: Math.round(co2/21).toLocaleString() },
    { icon:'🚗', label:'Car-free days',          value: Math.round(co2/4.6).toLocaleString() },
    { icon:'💧', label:'Litres water saved',     value: Math.round(totalMeals*200).toLocaleString() },
    { icon:'♻️', label:'Kg food waste avoided', value: Math.round(totalMeals*0.4).toLocaleString() },
  ];

  return (
    <div style={{maxWidth:1100,margin:'40px auto',padding:'0 32px'}}>
      {/* Header */}
      <div style={{marginBottom:36}}>
        <div style={{fontSize:11,fontWeight:600,color:'#e8330a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:8}}>Feeding India · Analytics</div>
        <h1 style={{fontSize:32,fontWeight:800,color:'#111827',marginBottom:8}}>Impact Dashboard</h1>
        <p style={{fontSize:15,color:'#6b7280'}}>Live data from your MongoDB database — refreshes on every page visit</p>
      </div>

      {/* Metrics */}
      <div className="metrics-grid" style={{marginBottom:36}}>
        {METRICS.map(m=>(
          <div className="metric-card" key={m.label} style={{borderTop:`3px solid ${m.color}`}}>
            <div className="metric-icon">{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{color:loading?'#d1d5db':'#111827'}}>
              {loading ? '—' : m.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:24}}>
        {/* Real weekly chart */}
        <div className="card">
          <div style={{fontWeight:700,fontSize:16,color:'#111827',marginBottom:4}}>📅 Meals rescued this week</div>
          <div style={{fontSize:12,color:'#9ca3af',marginBottom:20}}>Live from database · last 7 days</div>
          {loading ? (
            <div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af'}}>Loading...</div>
          ) : chartData.every(d=>d.meals===0) ? (
            <div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',color:'#9ca3af',fontSize:13}}>
              No delivered meals yet.<br/>Post and claim listings to see data here.
            </div>
          ) : (
            <div style={{display:'flex',gap:6,alignItems:'flex-end',height:160}}>
              {chartData.map((d,i)=>(
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,height:'100%',justifyContent:'flex-end'}}>
                  {d.meals>0 && <div style={{fontSize:9,color:'#9ca3af'}}>{(d.meals/1000).toFixed(1)}k</div>}
                  <div style={{
                    width:'100%',borderRadius:'4px 4px 0 0',
                    background:d.isToday?'#e8330a':'#fecdd3',
                    height:`${Math.max((d.meals/maxMeals)*140,d.meals>0?4:0)}px`,
                    transition:'height 0.5s ease', minHeight: d.meals>0?4:0,
                  }}/>
                  <div style={{fontSize:10,color:d.isToday?'#e8330a':'#9ca3af',fontWeight:d.isToday?700:400}}>{d.day}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Environmental impact */}
        <div className="card" style={{background:'linear-gradient(135deg,#f0fdf4,#fff)',border:'1px solid #bbf7d0'}}>
          <div style={{fontWeight:700,fontSize:16,color:'#15803d',marginBottom:20}}>🌍 Environmental impact</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {ENV.map(e=>(
              <div key={e.label} style={{background:'#fff',borderRadius:10,padding:'16px',border:'1px solid #d1fae5',textAlign:'center'}}>
                <div style={{fontSize:28,marginBottom:8}}>{e.icon}</div>
                <div style={{fontSize:20,fontWeight:800,color:'#15803d'}}>{loading?'—':e.value}</div>
                <div style={{fontSize:11,color:'#6b7280',marginTop:4}}>{e.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:24}}>
        {/* Real categories */}
        <div className="card">
          <div style={{fontWeight:700,fontSize:16,color:'#111827',marginBottom:4}}>🍱 Food categories rescued</div>
          <div style={{fontSize:12,color:'#9ca3af',marginBottom:20}}>By food type · all time</div>
          {loading ? <div style={{color:'#9ca3af',fontSize:13}}>Loading...</div>
          : categories.length===0 ? (
            <div style={{textAlign:'center',padding:'32px 0',color:'#9ca3af',fontSize:13}}>
              No delivered meals yet. Start donating!
            </div>
          ) : categories.map((c,i)=>(
            <div key={c.foodType} style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <div style={{width:18,fontSize:13,textAlign:'center'}}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}.`}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontSize:13,fontWeight:600}}>{FOOD_LABELS[c.foodType]||c.foodType}</span>
                  <span style={{fontSize:13,color:'#6b7280'}}>{c.meals.toLocaleString()} meals</span>
                </div>
                <div style={{height:6,background:'#f3f4f6',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${(c.meals/totalCatMeals)*100}%`,background:i===0?'#e8330a':'#fca5a5',borderRadius:3}}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donor leaderboard */}
        <div className="card">
          <div style={{fontWeight:700,fontSize:16,color:'#111827',marginBottom:4}}>🏆 Top donor restaurants</div>
          <div style={{fontSize:12,color:'#9ca3af',marginBottom:20}}>By total meals donated</div>
          {loading ? <div style={{color:'#9ca3af',fontSize:13}}>Loading...</div>
          : !stats?.topDonors?.length ? (
            <div style={{textAlign:'center',padding:'32px 0'}}>
              <div style={{fontSize:40,marginBottom:12}}>🏆</div>
              <div style={{fontSize:13,color:'#9ca3af'}}>Be the first donor on the leaderboard!</div>
            </div>
          ) : stats.topDonors.map((d,i)=>(
            <div key={d._id} style={{
              display:'flex',alignItems:'center',gap:12,padding:'12px 14px',marginBottom:6,borderRadius:10,
              background:i===0?'linear-gradient(135deg,#fffbeb,#fef3c7)':'var(--gray-50)',
              border:i===0?'1px solid #fde68a':'1px solid #f3f4f6',
            }}>
              <div style={{fontSize:20,width:28,textAlign:'center'}}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:'#111827'}}>{d.name}</div>
                {d.organization && <div style={{fontSize:11,color:'#9ca3af'}}>{d.organization}</div>}
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:15,fontWeight:800,color:'#111827'}}>{(d.stats?.totalMealsDonated||0).toLocaleString()}</div>
                <div style={{fontSize:11,color:'#9ca3af'}}>meals</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SDG Banner */}
      <div className="card" style={{background:'linear-gradient(135deg,#fff7f5,#fff1ee)',border:'1px solid #fdd',textAlign:'center',padding:'40px 32px'}}>
        <div style={{fontSize:36,marginBottom:12}}>🌐</div>
        <h2 style={{fontSize:22,fontWeight:800,color:'#111827',marginBottom:10}}>Contributing to UN Sustainable Development Goals</h2>
        <p style={{fontSize:14,color:'#6b7280',maxWidth:520,margin:'0 auto 24px',lineHeight:1.7}}>
          FoodBridge directly supports SDG 2 (Zero Hunger), SDG 12 (Responsible Consumption), and SDG 13 (Climate Action).
        </p>
        <div style={{display:'flex',justifyContent:'center',gap:16,flexWrap:'wrap'}}>
          {['🎯 SDG 2: Zero Hunger','♻️ SDG 12: Responsible Consumption','🌱 SDG 13: Climate Action'].map(s=>(
            <span key={s} style={{background:'#fff',border:'1px solid #fdd',padding:'10px 20px',borderRadius:20,fontSize:13,fontWeight:600,color:'#e8330a'}}>{s}</span>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:700px){.impact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
