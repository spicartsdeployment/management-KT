import React from 'react';
import { Card } from '@school-hrms/common-components';
import PageLoader from '../../components/PageLoader';
import { useAlumniDirectoryQuery } from '../../services/alumni.queries';
import '../../assets/scss/Alumni.scss';

// Sample fallback data when API fails
const _emptyAlumniData = {
  stats: { totalAlumni: 2480, companies: 340, countries: 28 },
  alumni: [
    { id: '1', name: 'Rajesh Kumar', title: 'Software Engineer', company: 'Google', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', tags: [{ label: 'Tech' }], yearsAfter: 5, connections: 1240 },
    { id: '2', name: 'Priya Sharma', title: 'Product Manager', company: 'Microsoft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', tags: [{ label: 'Tech' }], yearsAfter: 4, connections: 890 },
    { id: '3', name: 'Amit Patel', title: 'Finance Analyst', company: 'Goldman Sachs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', tags: [{ label: 'Finance' }], yearsAfter: 6, connections: 560 },
    { id: '4', name: 'Deepika Singh', title: 'Marketing Manager', company: 'Amazon', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', tags: [{ label: 'Marketing' }], yearsAfter: 3, connections: 740 },
  ],
};

/**
 * AlumniNetwork page component
 * Displays alumni statistics and directory with real-time API data
 * @returns {JSX.Element} Alumni network UI
 */
const AlumniNetwork = () => {
  const { data, isLoading, isError, error, refetch } = useAlumniDirectoryQuery();

  const stats = data?.stats ?? _emptyAlumniData.stats;
  const alumniDirectory = data?.alumni ?? _emptyAlumniData.alumni;

  // Loading state
  if (isLoading) {
    return <PageLoader title="Loading Alumni Network" subtitle="Fetching alumni data..." icon="🎓" />;
  }

  // Error state
  if (isError) {
    return (
      <div className="sch-alu-network-container" data-testid="school-container-alumni-network">
        {window.__HRMS__?.hasPermission?.('add_alumni') && (
          <button data-testid="school-button-add-alumni" className="sch-alu-network-btn-add">
            Add Alumni
          </button>
        )}
        <h1 className="sch-alu-network-title">Alumni Network</h1>
        <Card className="sch-alu-network-error-card" data-testid="school-card-alumni-error">
          <div className="error-container">
            <div className="error-icon">?</div>
            <h3 className="error-title">Error Loading Alumni Data</h3>
            <p className="error-message">{error?.message}</p>
            <button
              onClick={() => refetch()}
              className="sch-alu-button-retry"
              data-testid="school-button-retry-alumni"
            >
              ?? Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Success state - render data
  return (
    <div className="sch-alu-network-container" data-testid="school-container-alumni-network">
      {window.__HRMS__?.hasPermission?.('add_alumni') && (
        <button data-testid="school-button-add-alumni" className="sch-alu-network-btn-add">
          Add Alumni
        </button>
      )}
      <h1 className="sch-alu-network-title">Alumni Network</h1>

      {/* Alumni Statistics Cards */}
      <div className="sch-alu-stats-grid">
        <Card className="stat-card" data-testid="school-card-total-alumni">
          <div className="stat-icon">??</div>
          <div className="stat-label">Total Alumni</div>
          <div className="stat-value">{stats.totalAlumni || 0}</div>
        </Card>

        <Card className="stat-card" data-testid="school-card-active-members">
          <div className="stat-icon">?</div>
          <div className="stat-label">Active Members</div>
          <div className="stat-value">{stats.activeMembers || 0}</div>
        </Card>

        <Card className="stat-card" data-testid="school-card-upcoming-events">
          <div className="stat-icon">??</div>
          <div className="stat-label">Upcoming Events</div>
          <div className="stat-value">{stats.upcomingEvents || 0}</div>
        </Card>

        <Card className="stat-card" data-testid="school-card-mentors">
          <div className="stat-icon">??</div>
          <div className="stat-label">Mentors Available</div>
          <div className="stat-value">{stats.mentorsAvailable || 0}</div>
        </Card>
      </div>

      {/* Alumni Directory */}
      {alumniDirectory.length > 0 ? (
        <Card
          className="sch-alu-network-card sch-alu-directory-card"
          data-testid="school-card-alumni-directory"
        >
          <h2 className="directory-title">Alumni Directory</h2>
          <div className="alumni-list">
            {alumniDirectory.map((alumni, idx) => (
              <div
                key={alumni.id || idx}
                className="alumni-item"
                data-testid={`school-item-alumni-${alumni.id || idx}`}
              >
                <div className="alumni-avatar">
                  {alumni.initials || '??'}
                </div>
                <div className="alumni-info">
                  <div className="alumni-name">{alumni.name || 'Unknown'}</div>
                  <div className="alumni-batch">{alumni.batch || 'N/A'}</div>
                  {alumni.email && <div className="alumni-email">{alumni.email}</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card
          className="sch-alu-network-card sch-alu-empty-card"
          data-testid="school-card-alumni-directory-empty"
        >
          <p className="empty-message">No alumni found in directory</p>
        </Card>
      )}
    </div>
  );
};

export default AlumniNetwork;
