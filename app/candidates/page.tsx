"use client";

import { useState } from "react";
import Sidebar from "@/app/dashboard/components/Sidebar";
import TopBar from "@/app/dashboard/components/TopBar";
import {
  Grid, List, Filter, ChevronDown, ChevronUp, Search,
  Star, Mail, Phone, MapPin, Briefcase, GraduationCap,
  CheckCircle, Clock, XCircle, Eye
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  experience: string;
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'rejected';
  rating: number;
  avatar: string;
  skills: string[];
}

const mockCandidates: Candidate[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-0101', location: 'New York, NY', role: 'Senior Frontend Developer', experience: '5 years', status: 'interview', rating: 4.5, avatar: 'SJ', skills: ['React', 'TypeScript', 'Next.js'] },
  { id: '2', name: 'Michael Chen', email: 'michael.c@email.com', phone: '+1 555-0102', location: 'San Francisco, CA', role: 'Full Stack Engineer', experience: '7 years', status: 'offered', rating: 5, avatar: 'MC', skills: ['Node.js', 'Python', 'AWS'] },
  { id: '3', name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 555-0103', location: 'Austin, TX', role: 'UX Designer', experience: '4 years', status: 'screening', rating: 4, avatar: 'ED', skills: ['Figma', 'Adobe XD', 'Sketch'] },
  { id: '4', name: 'James Wilson', email: 'james.w@email.com', phone: '+1 555-0104', location: 'Seattle, WA', role: 'DevOps Engineer', experience: '6 years', status: 'applied', rating: 3.5, avatar: 'JW', skills: ['Docker', 'Kubernetes', 'CI/CD'] },
  { id: '5', name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '+1 555-0105', location: 'Boston, MA', role: 'Data Scientist', experience: '3 years', status: 'rejected', rating: 3, avatar: 'LA', skills: ['Python', 'ML', 'TensorFlow'] },
  { id: '6', name: 'Robert Taylor', email: 'robert.t@email.com', phone: '+1 555-0106', location: 'Chicago, IL', role: 'Backend Developer', experience: '8 years', status: 'interview', rating: 4.8, avatar: 'RT', skills: ['Java', 'Spring', 'Microservices'] },
];

const statusConfig = {
  applied: { label: 'Applied', color: '#6b7280', icon: Clock },
  screening: { label: 'Screening', color: '#3b82f6', icon: Eye },
  interview: { label: 'Interview', color: '#f59e0b', icon: Briefcase },
  offered: { label: 'Offered', color: '#10b981', icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#ef4444', icon: XCircle },
};

export default function CandidatesPage() {
  // Toggle states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Status filter toggles
  const [statusFilters, setStatusFilters] = useState({
    applied: true,
    screening: true,
    interview: true,
    offered: true,
    rejected: true,
  });

  // Toggle individual status filter
  const toggleStatusFilter = (status: keyof typeof statusFilters) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
  };

  // Toggle all filters
  const toggleAllFilters = (value: boolean) => {
    setStatusFilters({
      applied: value,
      screening: value,
      interview: value,
      offered: value,
      rejected: value,
    });
  };

  // Filter candidates based on search and status
  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilters[candidate.status];
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={14}
            fill={star <= rating ? '#f59e0b' : 'transparent'}
            style={{ color: star <= rating ? '#f59e0b' : 'var(--text-muted)' }}
          />
        ))}
        <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>{rating}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <TopBar />

        {/* Header with Search and View Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Candidates
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {filteredCandidates.length} candidates found
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  width: '250px'
                }}
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: showFilters ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: showFilters ? 'white' : 'var(--text-primary)'
              }}
            >
              <Filter size={18} />
              Filters
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 transition-all"
                style={{
                  backgroundColor: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: viewMode === 'grid' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-2 transition-all"
                style={{
                  backgroundColor: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: viewMode === 'list' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Filters Section */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: showFilters ? '200px' : '0',
            opacity: showFilters ? 1 : 0
          }}
        >
          <div className="rounded-xl p-6" style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Filter by Status</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAllFilters(true)}
                  className="text-sm px-3 py-1 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                  Select All
                </button>
                <button
                  onClick={() => toggleAllFilters(false)}
                  className="text-sm px-3 py-1 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map(status => {
                const config = statusConfig[status];
                const isActive = statusFilters[status];
                const Icon = config.icon;

                return (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: isActive ? config.color : 'var(--bg-tertiary)',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      border: `1px solid ${isActive ? config.color : 'var(--border-subtle)'}`
                    }}
                  >
                    <Icon size={16} />
                    {config.label}
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)'
                    }}>
                      {mockCandidates.filter(c => c.status === status).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Candidates Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map(candidate => {
              const statusInfo = statusConfig[candidate.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={candidate.id}
                  className="rounded-xl p-6 hover:scale-[1.02] transition-transform cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)' }}
                      >
                        {candidate.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{candidate.name}</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{candidate.role}</p>
                      </div>
                    </div>
                    <span
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                    >
                      <StatusIcon size={12} />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <MapPin size={14} /> {candidate.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <GraduationCap size={14} /> {candidate.experience} experience
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {candidate.skills.map(skill => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {renderStars(candidate.rating)}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <tr>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Candidate</th>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Role</th>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Location</th>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Status</th>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Rating</th>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate, index) => {
                  const statusInfo = statusConfig[candidate.status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={candidate.id}
                      className="hover:opacity-80 cursor-pointer transition-opacity"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderBottom: index < filteredCandidates.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                      }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm"
                            style={{ background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)' }}
                          >
                            {candidate.avatar}
                          </div>
                          <span style={{ color: 'var(--text-primary)' }}>{candidate.name}</span>
                        </div>
                      </td>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{candidate.role}</td>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{candidate.location}</td>
                      <td className="p-4">
                        <span
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit"
                          style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="p-4">{renderStars(candidate.rating)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                          </button>
                          <button className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No candidates found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); toggleAllFilters(true); }}
              className="mt-4 px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
