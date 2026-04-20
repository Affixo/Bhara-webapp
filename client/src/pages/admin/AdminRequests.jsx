import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/requests').then(r => { setRequests(r.data); setLoading(false); });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="text-emerald-600 hover:underline text-sm">← Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-800">All Rent Requests ({requests.length})</h1>
      </div>
      {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Listing', 'Requester', 'Owner', 'Move-in', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map(r => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-700 font-medium max-w-xs truncate">
                    <Link to={`/listings/${r.listing?._id}`} className="hover:text-emerald-600">{r.listing?.title || 'N/A'}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.requester?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{r.owner?.name}</td>
                  <td className="px-4 py-3 text-gray-400">{r.moveInDate ? new Date(r.moveInDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}