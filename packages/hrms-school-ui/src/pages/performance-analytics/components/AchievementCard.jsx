import React from 'react';
import PropTypes from 'prop-types';

/**
 * CategoryTag - colored pill for the achievement category and result text.
 * The :first-child pill gets a filled background; the :not(:first-child) place
 * text gets only a matching color, creating the "pill + bare text" pairing.
 */
export const CategoryTag = ({ category, place, type }) => (
  <div className="achievement-tags" data-testid={`school-tags-${type}`}>
    <span className={`achievement-tag tag-${type}`}>{category}</span>
    <span className={`achievement-tag tag-${type}`}>{place}</span>
  </div>
);

CategoryTag.propTypes = {
  category: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

/**
 * AchievementCard - one achievement row:
 * circular emoji icon  |  title + category pill + place text + date
 */
const AchievementCard = ({ achievement }) => (
  <div
    className="achievement-item"
    data-testid={`school-achievement-${achievement.id}`}
  >
    <div className={`achievement-icon ${achievement.type}`} aria-hidden="true">
      {achievement.icon}
    </div>
    <div className="achievement-details">
      <h4 className="achievement-name">{achievement.name}</h4>
      <CategoryTag
        category={achievement.category}
        place={achievement.place}
        type={achievement.type}
      />
      <span className="achievement-month">{achievement.month}</span>
    </div>
  </div>
);

AchievementCard.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default AchievementCard;
