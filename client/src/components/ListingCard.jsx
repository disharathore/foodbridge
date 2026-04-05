import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';

const STATUS = {
  available:  { label: 'Available',  cls: 'badge-green' },
  claimed:    { label: 'Claimed',    cls: 'badge-amber' },
  in_transit: { label: 'In Transit', cls: 'badge-blue' },
  delivered:  { label: 'Delivered',  cls: 'badge-gray' },
  expired:    { label: 'Expired',    cls: 'badge-red' },
};

const FOOD_IMAGES = {
  main_course: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=120&fit=crop&auto=format',
  bread:       'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=120&fit=crop&auto=format',
  dessert:     'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=120&fit=crop&auto=format',
  salad:       'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=120&fit=crop&auto=format',
  beverage:    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=120&fit=crop&auto=format',
  other:       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=120&fit=crop&auto=format',
};
const FOOD_EMOJI = { main_course:'🍛', bread:'🍞', dessert:'🎂', salad:'🥗', beverage:'🥤', other:'🍱' };

export default function ListingCard({ listing }) {
  const { emit } = useApp();
  const { user, authHeaders } = useAuth();
  const s = STATUS[listing.status] || STATUS.available;

  const handleClaim = async () => {
    const toastId = toast.loading('Claiming listing...');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/listings/${listing._id}/claim`,
        { method: 'PATCH', headers: authHeaders() }
      );
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to claim', { id: toastId }); return; }
      emit('listing:claim', { ...data, city: listing.location?.city });
      toast.success(`✅ Claimed ${listing.portions} meals from ${listing.restaurantName}!`, { id: toastId });
    } catch {
      toast.error('Network error. Try again.', { id: toastId });
    }
  };

  const handleDeliver = async () => {
    const toastId = toast.loading('Marking as delivered...');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/listings/${listing._id}/status`,
        { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status: 'delivered' }) }
      );
      const data = await res.json();
      if (!res.ok) { toast.error(data.error, { id: toastId }); return; }
      emit('listing:delivered', { ...data, city: listing.location?.city });
      toast.success('🎉 Delivery confirmed! Impact recorded.', { id: toastId });
    } catch {
      toast.error('Network error.', { id: toastId });
    }
  };

  const timeAgo = listing.createdAt ? (() => {
    const diff = Math.floor((Date.now() - new Date(listing.createdAt)) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff/60)}h ago`;
  })() : '';

  const imgSrc = FOOD_IMAGES[listing.foodType] || FOOD_IMAGES.other;
  const emoji  = FOOD_EMOJI[listing.foodType] || '🍱';

  return (
    <div className="listing-card">
      <div className="listing-img-wrap">
        <img
          className="listing-img"
          src={imgSrc}
          alt={listing.foodType}
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
        />
        <div className="listing-emoji-fallback" style={{ display: 'none' }}>{emoji}</div>
      </div>

      <div className="listing-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <div className="listing-name">{listing.restaurantName}</div>
          <span className={`badge ${s.cls}`}>{s.label}</span>
        </div>
        <div className="listing-meta">
          📍 {listing.location?.address || listing.location?.city || 'Delhi'}
          &nbsp;·&nbsp; {listing.foodType?.replace('_', ' ')}
          {listing.donor?.name && <span>&nbsp;·&nbsp; {listing.donor.organization || listing.donor.name}</span>}
        </div>
        {listing.description && (
          <div className="listing-desc">"{listing.description}"</div>
        )}
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 5 }}>
          {timeAgo && `Posted ${timeAgo}`}
          {listing.expiresAt && ` · Expires ${new Date(listing.expiresAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`}
        </div>
      </div>

      <div className="listing-right">
        <div className="listing-portions">{listing.portions}</div>
        <div className="listing-time">meals</div>

        {listing.status === 'available' && user?.role === 'ngo' && (
          <button className="claim-btn" onClick={handleClaim}>Claim →</button>
        )}
        {listing.status === 'claimed' && user?.role === 'volunteer' && (
          <button className="claim-btn" onClick={async () => {
            const toastId = toast.loading('Marking as picked up...');
            try {
              const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/listings/${listing._id}/status`, { method:'PATCH', headers:authHeaders(), body:JSON.stringify({status:'in_transit'}) });
              const data = await res.json();
              if (!res.ok) { toast.error(data.error, {id:toastId}); return; }
              emit('listing:pickup', { ...data, city: listing.location?.city });
              toast.success('🚗 Marked as picked up!', {id:toastId});
            } catch { toast.error('Network error.', {id:toastId}); }
          }} style={{ background: '#2563eb' }}>Pick up</button>
        )}
        {listing.status === 'in_transit' && (user?.role === 'volunteer' || String(listing.claimedBy) === user?.id) && (
          <button className="deliver-btn" onClick={handleDeliver}>Delivered ✓</button>
        )}
        {!user && listing.status === 'available' && (
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, maxWidth: 80 }}>Sign in to claim</div>
        )}
      </div>
    </div>
  );
}
