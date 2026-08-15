'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Briefcase, Clock } from 'lucide-react';
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // The API exists at /api/v1/leads, it takes some params. 
      // We will just fetch the first 50.
      const res = await fetch('/api/v1/leads?pageSize=50');
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || []);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Captured Leads</h1>
        <p className="text-gray-400">Leads generated from the AI Chatbot and other sources.</p>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-12">Loading leads...</div>
      ) : leads.length > 0 ? (
        <div className="bg-[#111118] border border-[#1F1F1F] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-[#0A0A0A] border-b border-[#1F1F1F]">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-[#1A1A24]">
                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {lead.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {lead.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-gray-500"/> {lead.email}</div>}
                        {lead.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-500"/> {lead.phone}</div>}
                        {!lead.email && !lead.phone && <span className="text-gray-500 italic">No contact provided</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {lead.city && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-500"/> {lead.city}</div>}
                        {lead.investmentRange && <div className="flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-gray-500"/> {lead.investmentRange}</div>}
                        {!lead.city && !lead.investmentRange && <span className="text-gray-500 italic">-</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full border",
                        lead.status === 'NEW' ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                        "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      )}>
                        {lead.status || 'NEW'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12 border border-dashed border-[#2E2E3E] rounded-xl">
          <p>No leads found.</p>
        </div>
      )}
    </div>
  );
}
