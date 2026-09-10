import React from 'react';

const ResourceList = ({ resources }) => {
  return (
    <div className="ru-card" data-testid="teacher-resources-list">
      <h3 className="ru-card-title">Uploaded Resources</h3>
      <div className="ru-items">
        {resources.map((resource) => (
          <div key={resource.id} className="ru-item" data-testid={`teacher-resource-${resource.id}`}>
            <div className="ru-item-icon">📄</div>
            <div className="ru-item-info">
              <div className="ru-item-name">{resource.name}</div>
              <div className="ru-item-meta">
                {resource.type} • {resource.size} • {resource.date}
              </div>
            </div>
            <button className="ru-item-action" data-testid={`teacher-resource-delete-${resource.id}`}>
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
