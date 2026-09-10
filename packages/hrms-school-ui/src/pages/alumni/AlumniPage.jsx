import React, { useReducer, useMemo } from 'react';
import { AlumniContext } from './context';
import { alumniReducer, initialState } from './reducer';
import StatsCards from './components/StatsCards';
import Tabs from './components/Tabs';
import Filters from './components/Filters';
import AlumniDirectory from './components/AlumniDirectory';
import EventsTab from './components/EventsTab';
import MentorshipTab from './components/MentorshipTab';
import { useAlumniDirectoryQuery, useAlumniEventsQuery, useAlumniMentorshipQuery } from '../../services/alumni.queries';
import PageLoader from '../../components/PageLoader';
import '../../assets/scss/Alumni.scss';

// Sample fallback data when API fails
const _emptyAlumniData = {
  alumni: [
    { id: '1', name: 'Rajesh Kumar', title: 'Software Engineer', company: 'Google', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', tags: [{ label: 'Tech' }], yearsAfter: 5, connections: 1240 },
    { id: '2', name: 'Priya Sharma', title: 'Product Manager', company: 'Microsoft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', tags: [{ label: 'Tech' }], yearsAfter: 4, connections: 890 },
    { id: '3', name: 'Amit Patel', title: 'Finance Analyst', company: 'Goldman Sachs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', tags: [{ label: 'Finance' }], yearsAfter: 6, connections: 560 },
    { id: '4', name: 'Deepika Singh', title: 'Marketing Manager', company: 'Amazon', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', tags: [{ label: 'Marketing' }], yearsAfter: 3, connections: 740 },
  ],
  stats: { totalAlumni: 2480, companies: 340, countries: 28 },
};

const _emptyEventsData = [
  { id: '1', title: 'Annual Alumni Summit 2026', dateTime: 'June 15, 2026 at 10:00 AM', location: 'Delhi', attendees: 234, tag: 'Conference', tagColor: 'sch-alu-event-tag-conference' },
  { id: '2', title: 'Tech Career Meetup', dateTime: 'May 20, 2026 at 6:00 PM', location: 'Bangalore', attendees: 89, tag: 'Networking', tagColor: 'sch-alu-event-tag-networking' },
  { id: '3', title: 'Entrepreneurship Workshop', dateTime: 'June 1, 2026 at 2:00 PM', location: 'Mumbai', attendees: 145, tag: 'Workshop', tagColor: 'sch-alu-event-tag-workshop' },
];

const _emptyMentorsData = [
  { id: '1', name: 'Vikram Gupta', title: 'CEO & Founder', company: 'TechStart India', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', tags: [{ label: 'Entrepreneurship' }], yearsAfter: 12, connections: 3200 },
  { id: '2', name: 'Neha Rao', title: 'Design Lead', company: 'Adobe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', tags: [{ label: 'Design' }], yearsAfter: 8, connections: 1560 },
];

// eslint-disable-next-line max-lines-per-function
export default function AlumniPage() {
  const [state, dispatch] = useReducer(alumniReducer, initialState);
  const { tab, search, industry } = state;

  const { data: directoryData, isLoading: loadingDir } = useAlumniDirectoryQuery();
  const { data: eventsData, isLoading: loadingEvents } = useAlumniEventsQuery();
  const { data: mentorsData, isLoading: loadingMentors } = useAlumniMentorshipQuery();

  const isLoading = loadingDir || loadingEvents || loadingMentors;
  const alumni = directoryData?.alumni ?? _emptyAlumniData.alumni;
  const directoryStats = directoryData?.stats ?? _emptyAlumniData.stats;
  const events = eventsData ?? _emptyEventsData;
  const mentors = mentorsData ?? _emptyMentorsData;

  // Filtered alumni list
  const filteredAlumni = useMemo(() => {
    let list = alumni;
    if (industry && industry !== 'All Industries') {
      list = list.filter((a) => a.tags.some((t) => t.label === industry));
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((a) =>
        a.name.toLowerCase().includes(s) ||
        a.company.toLowerCase().includes(s) ||
        a.title.toLowerCase().includes(s)
      );
    }
    return list;
  }, [alumni, search, industry]);

  // Handlers
  const handleTabChange = (newTab) => dispatch({ type: 'SET_TAB', tab: newTab });
  const handleSearch = (e) => dispatch({ type: 'SET_SEARCH', search: e.target.value });
  const handleIndustryChange = (ind) => dispatch({ type: 'SET_INDUSTRY', industry: ind });
  const handleConnect = (a) => alert(`Connect with ${a.name}`);
  const handleMessage = (a) => alert(`Message to ${a.name}`);
  const handleCall = (a) => alert(`Call to ${a.name}`);
  const handleRegister = (event) => alert(`Register for ${event.title}`);
  const handleLearnMore = (event) => alert(`Learn more about ${event.title}`);
  const handleBrowseMentors = () => alert('Browse Mentors');
  const handleJoinMentor = () => alert('Join as Mentor');

  // Loading UI
  if (isLoading) {
    return <PageLoader title="Loading Alumni Network" subtitle="Fetching alumni data..." icon="🎓" />;
  }

  return (
    <AlumniContext.Provider value={{ state, dispatch }}>
      <div className="sch-alu-page-container">
        <div className="sch-alu-page-header">
          <div>
            <h1 className="sch-alu-page-title">
              Alumni Network
            </h1>
            <p className="sch-alu-page-subtitle">
              Connect with former students and grow your professional network
            </p>
          </div>
          <button
            className="sch-alu-page-btn-join"
            data-testid="alumni-button-join-network"
            onClick={() => window.open(`${window.location.origin}/alumni-enroll.html`, '_blank', 'noopener,noreferrer')}
          >
            Join Alumni Network
          </button>
        </div>

        {/* Stats */}
        <StatsCards directoryStats={{ ...directoryStats, upcomingEvents: events.length }} />

        {/* Tabs */}
        <Tabs activeTab={tab} onTabChange={handleTabChange} />

        {/* Filters (only for Directory) */}
        {tab === 'directory' && (
          <div className="sch-alu-filters-container">
            <div className="sch-alu-search-wrapper">
              <span className="sch-alu-search-icon">
                <svg className="sch-alu-icon-search" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </span>
              <input
                className="sch-alu-search-input"
                placeholder="Search alumni by name, company, or position..."
                value={search}
                onChange={handleSearch}
                data-testid="alumni-search"
              />
            </div>
            <div className="sch-alu-filter-wrapper">
              <Filters industry={industry} onIndustryChange={handleIndustryChange} />
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="sch-alu-tab-content">
          {tab === 'directory' && (
            <AlumniDirectory
              alumniList={filteredAlumni}
              onConnect={handleConnect}
              onMessage={handleMessage}
              onCall={handleCall}
            />
          )}
          {tab === 'events' && (
            <EventsTab
              events={events}
              onRegister={handleRegister}
              onLearnMore={handleLearnMore}
            />
          )}
          {tab === 'mentorship' && (
            <MentorshipTab
              mentors={mentors}
              onBrowseMentors={handleBrowseMentors}
              onJoinMentor={handleJoinMentor}
            />
          )}
        </div>
      </div>
    </AlumniContext.Provider>
  );
}