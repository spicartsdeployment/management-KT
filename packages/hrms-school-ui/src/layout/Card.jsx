import '../assets/scss/SchoolLayout.scss'

/**
 * Layout Card Component
 * Converted from Tailwind: rounded-2xl shadow-glass bg-white/80 dark:bg-dark-card/80 backdrop-blur-glass p-4 transition hover:shadow-lg
 */
const Card = ({ children, className = '' }) => (
  <div className={`sch-layout-card ${className}`}>
    {children}
  </div>
)
export default Card
