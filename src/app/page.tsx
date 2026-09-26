'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import StatsBanner from '@/components/StatsBanner';
import CampaignCard from '@/components/CampaignCard';
import DummyPaymentPortal from '@/components/DummyPaymentPortal';
import VolunteerModal from '@/components/VolunteerModal';
import NewCampaignModal from '@/components/NewCampaignModal';
import NewTaskModal from '@/components/NewTaskModal';
import AuthModal from '@/components/AuthModal';
import TutorialModal from '@/components/TutorialModal';
import AdminPortal from '@/components/AdminPortal';
import TaskKanban from '@/components/TaskKanban';
import VolunteerDirectory from '@/components/VolunteerDirectory';
import TransparencyLedger from '@/components/TransparencyLedger';
import { Campaign, Volunteer, Task, Donation, PlatformStats, User } from '@/lib/types';
import { 
  Flame, 
  Users, 
  CheckSquare, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldAlert, 
  Compass,
  RefreshCw,
  BookOpen,
  CreditCard
} from 'lucide-react';

export default function Home() {
  // Navigation & View Mode State
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [activeTab, setActiveTab] = useState<'drives' | 'tasks' | 'volunteers' | 'ledger'>('drives');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Global Emergency Broadcast Alert
  const [emergencyAlert, setEmergencyAlert] = useState<string>(
    'FLASH UPDATE: Monsoon High Alert in Lowland River Basin. Emergency water kits and logistics teams mobilizing.'
  );

  // Data States
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [paymentPortalOpen, setPaymentPortalOpen] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [newCampaignModalOpen, setNewCampaignModalOpen] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [selectedCampaignForAction, setSelectedCampaignForAction] = useState<Campaign | null>(null);

  // Load Session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('reliefgrid_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        if (parsed.role === 'admin') setViewMode('admin');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('reliefgrid_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    if (user.role === 'admin') {
      setViewMode('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('reliefgrid_user');
    } catch {
      // ignore
    }
    setViewMode('public');
  };

  // Data Fetching
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [campRes, volRes, taskRes, donRes, statsRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch('/api/volunteers'),
        fetch('/api/tasks'),
        fetch('/api/donations'),
        fetch('/api/stats'),
      ]);

      const [campData, volData, taskData, donData, statsData] = await Promise.all([
        campRes.json(),
        volRes.json(),
        taskRes.json(),
        donRes.json(),
        statsRes.json(),
      ]);

      if (Array.isArray(campData)) setCampaigns(campData);
      if (Array.isArray(volData)) setVolunteers(volData);
      if (Array.isArray(taskData)) setTasks(taskData);
      if (Array.isArray(donData)) setDonations(donData);
      if (statsData?.stats) setStats(statsData.stats);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Modal Handlers
  const handleOpenDonate = (campaign: Campaign) => {
    setSelectedCampaignForAction(campaign);
    setPaymentPortalOpen(true);
  };

  const handleOpenVolunteer = (campaign: Campaign) => {
    setSelectedCampaignForAction(campaign);
    setVolunteerModalOpen(true);
  };

  // Category filters
  const categories = ['All', 'Disaster Relief', 'Food & Hunger', 'Winter Relief', 'Education'];

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-black flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* Top Brutalist Navigation */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenNewCampaign={() => setNewCampaignModalOpen(true)}
        onOpenNewTask={() => setNewTaskModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenTutorial={() => setTutorialModalOpen(true)}
        onOpenPaymentPortal={() => {
          setSelectedCampaignForAction(null);
          setPaymentPortalOpen(true);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        activeCampaignsCount={campaigns.length}
        emergencyAlert={emergencyAlert}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {/* If NGO Command Portal is active, show the Admin Management Suite */}
        {viewMode === 'admin' ? (
          <div className="animate-fade-in">
            <AdminPortal
              campaigns={campaigns}
              volunteers={volunteers}
              tasks={tasks}
              donations={donations}
              onRefreshData={fetchAllData}
              onOpenNewCampaign={() => setNewCampaignModalOpen(true)}
              onOpenNewTask={() => setNewTaskModalOpen(true)}
              emergencyAlert={emergencyAlert}
              setEmergencyAlert={setEmergencyAlert}
            />
          </div>
        ) : (
          /* Public Donor & Volunteer Portal */
          <>
            {/* Hero Mission Directive Banner */}
            <section className="bg-black text-white p-6 sm:p-10 border-2 border-black shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 -mr-20 -mt-20 border border-orange-500/20 rotate-12 pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-orange-600 text-white font-mono font-bold text-[10px] uppercase px-2.5 py-1 tracking-widest border border-white">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  National Emergency & Community Response Portal
                </div>

                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-tight text-white">
                  Coordinate Relief. <br />
                  <span className="text-orange-500">Mobilize Volunteers.</span> Track Every Dollar.
                </h1>

                <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">
                  Replacing scattered spreadsheets and chat groups with a real-time command dashboard. 
                  Track critical donation targets, dispatch on-ground volunteer teams, and guarantee 100% financial transparency.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setSelectedCampaignForAction(null);
                      setPaymentPortalOpen(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-xs uppercase px-5 py-3 border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Open Payment Portal</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCampaignForAction(null);
                      setVolunteerModalOpen(true);
                    }}
                    className="bg-white hover:bg-neutral-100 text-black font-mono font-black text-xs uppercase px-5 py-3 border-2 border-white shadow-[3px_3px_0px_0px_rgba(234,88,12,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-orange-600" />
                    <span>Enlist as Volunteer</span>
                  </button>

                  <button
                    onClick={() => setTutorialModalOpen(true)}
                    className="bg-transparent hover:bg-neutral-900 text-neutral-300 hover:text-white font-mono font-bold text-xs uppercase px-4 py-3 border-2 border-neutral-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    <span>Interactive Tutorial</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Real-time KPI Stats Banner */}
            <StatsBanner stats={stats} loading={loading} />

            {/* Tab Navigation Controls - Sharp Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b-2 border-black">
              <div className="flex overflow-x-auto gap-2 -mb-[2px] pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab('drives')}
                  className={`flex items-center gap-2 px-5 py-3 font-mono font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
                    activeTab === 'drives'
                      ? 'bg-orange-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black border-transparent hover:border-black hover:bg-neutral-100'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  Active Drives ({campaigns.length})
                </button>

                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`flex items-center gap-2 px-5 py-3 font-mono font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
                    activeTab === 'tasks'
                      ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(234,88,12,1)]'
                      : 'bg-white text-black border-transparent hover:border-black hover:bg-neutral-100'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Volunteer Kanban ({tasks.length})
                </button>

                <button
                  onClick={() => setActiveTab('volunteers')}
                  className={`flex items-center gap-2 px-5 py-3 font-mono font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
                    activeTab === 'volunteers'
                      ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(234,88,12,1)]'
                      : 'bg-white text-black border-transparent hover:border-black hover:bg-neutral-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Volunteer Corps ({volunteers.length})
                </button>

                <button
                  onClick={() => setActiveTab('ledger')}
                  className={`flex items-center gap-2 px-5 py-3 font-mono font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
                    activeTab === 'ledger'
                      ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(234,88,12,1)]'
                      : 'bg-white text-black border-transparent hover:border-black hover:bg-neutral-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Public Ledger ({donations.length})
                </button>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto mb-2 sm:mb-0">
                <button
                  onClick={fetchAllData}
                  title="Refresh live data from Supabase"
                  className="p-2 border-2 border-black bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-600' : 'text-black'}`} />
                </button>
              </div>
            </div>

            {/* Tab 1: Donation Drives & Campaigns View */}
            {activeTab === 'drives' && (
              <div className="space-y-6 animate-fade-in">
                {/* Filter & Search Bar */}
                <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-neutral-500 mr-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-black" /> Filter:
                    </span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 transition-all ${
                          selectedCategory === cat
                            ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-300 hover:border-black hover:bg-neutral-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search drive, location, keywords..."
                      className="w-full bg-white border-2 border-black pl-9 pr-3 py-2 text-xs font-mono text-black focus:outline-hidden focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                </div>

                {/* Campaign Cards Grid */}
                {filteredCampaigns.length === 0 ? (
                  <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Compass className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <h3 className="text-base font-black text-black uppercase font-mono">
                      No active campaigns match your criteria
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono mt-1 mb-4">
                      Try adjusting the filter or search keywords.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchQuery('');
                      }}
                      className="bg-black text-white font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((camp) => (
                      <CampaignCard
                        key={camp.id}
                        campaign={camp}
                        onDonate={handleOpenDonate}
                        onVolunteer={handleOpenVolunteer}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Volunteer Task Kanban */}
            {activeTab === 'tasks' && (
              <div className="animate-fade-in">
                <TaskKanban
                  tasks={tasks}
                  onTaskUpdated={fetchAllData}
                  onOpenNewTask={() => setNewTaskModalOpen(true)}
                />
              </div>
            )}

            {/* Tab 3: Volunteer Directory */}
            {activeTab === 'volunteers' && (
              <div className="animate-fade-in">
                <VolunteerDirectory
                  volunteers={volunteers}
                  onOpenVolunteerModal={() => {
                    setSelectedCampaignForAction(null);
                    setVolunteerModalOpen(true);
                  }}
                />
              </div>
            )}

            {/* Tab 4: Public Transparency Ledger */}
            {activeTab === 'ledger' && (
              <div className="animate-fade-in">
                <TransparencyLedger donations={donations} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer - Sharp Industrial Style */}
      <footer className="border-t-2 border-black bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 border border-black"></div>
            <span className="font-bold text-black uppercase tracking-wider">
              RELIEFGRID // OPEN NGO DISPATCH
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500 text-center sm:text-right">
            <button
              onClick={() => setTutorialModalOpen(true)}
              className="text-black hover:text-orange-600 underline font-bold"
            >
              How It Works
            </button>
            <span>•</span>
            <span>Connected to Supabase PostgreSQL</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <DummyPaymentPortal
        campaigns={campaigns}
        selectedCampaign={selectedCampaignForAction}
        currentUser={currentUser}
        isOpen={paymentPortalOpen}
        onClose={() => setPaymentPortalOpen(false)}
        onPaymentSuccess={fetchAllData}
      />

      <VolunteerModal
        campaigns={campaigns}
        selectedCampaign={selectedCampaignForAction}
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        onVolunteerSuccess={fetchAllData}
      />

      <NewCampaignModal
        isOpen={newCampaignModalOpen}
        onClose={() => setNewCampaignModalOpen(false)}
        onSuccess={fetchAllData}
      />

      <NewTaskModal
        campaigns={campaigns}
        volunteers={volunteers}
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        onSuccess={fetchAllData}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <TutorialModal
        isOpen={tutorialModalOpen}
        onClose={() => setTutorialModalOpen(false)}
        onStartDemo={() => {
          setSelectedCampaignForAction(null);
          setPaymentPortalOpen(true);
        }}
      />
    </div>
  );
}
