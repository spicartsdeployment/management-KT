import React from 'react';
import AlumniCard from './AlumniCard';

export default function AlumniDirectory({ alumniList, onConnect, onMessage, onCall }) {
  if (alumniList.length === 0) {
    return (
      <div className="sch-alu-no-results">
        <svg className="sch-alu-no-results__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="sch-alu-no-results__title">No Alumni Found</h3>
        <p className="sch-alu-no-results__message">
          We couldn&apos;t find any alumni matching your search criteria. Please try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="sch-alu-directory-grid">
      {alumniList.map((alumni) => (
        <AlumniCard
          key={alumni.id}
          alumni={alumni}
          onConnect={onConnect}
          onMessage={onMessage}
          onCall={onCall}
        />
      ))}
    </div>
  );
}


