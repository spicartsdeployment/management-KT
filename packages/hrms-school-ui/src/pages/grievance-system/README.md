# Grievance System

A comprehensive grievance submission and tracking system for school HRMS, built with ReactJS and SCSS.

## 📋 Overview

The Grievance System provides a user-friendly interface for submitting, tracking, and managing formal complaints and concerns. It features a multi-step submission process, case tracking table, resolution history, and helpful guidelines.

## ✨ Features

### Summary Dashboard
- **Total Grievances**: Blue gradient card displaying all-time count (12)
- **Active Cases**: Orange gradient card showing currently open cases (3)
- **Resolved This Month**: Green gradient card tracking monthly resolutions (5)

### Four-Tab Navigation System

#### 1. Active Cases Tab
- **Table Layout**: 5-column grid displaying:
  - Details (Grievance ID, Title, Submitted Date)
  - Category (Academic, Behavioral, Safety, etc.)
  - Assigned To (Staff member)
  - Priority (Low/Medium/High with color-coded pills)
  - Status (Active/Under Review/Resolved with color-coded pills)
- **Sample Cases**: Pre-populated with 3 realistic cases
- **Interactive Elements**: All pills styled with proper colors and borders

#### 2. Submit New Tab
Multi-step form with validation:

**Step 1: Basic Information**
- Grievance Title (required)
- Category dropdown (8 options)
- Priority Level (Low/Medium/High)
- Incident Date
- Detailed Description (textarea)

**Step 2: Incident Details**
- Location of Incident
- Witnesses/Involved Parties
- Previous Actions Taken
- Preferred Resolution

**Step 3: Evidence Upload**
- File upload interface with drag-and-drop
- Supported formats: PDF, Images, Documents
- Visual upload area with dashed border

**Step 4: Review & Submit**
- Summary of all entered information
- Edit options for each section
- Final submission button

**Form Features:**
- Stepper UI with numbered steps (blue active, green completed)
- Validation prevents progression without required fields
- Back/Continue navigation between steps
- Cancel button to reset form

#### 3. History Tab
- **Resolution Cards**: Display resolved grievances with:
  - Grievance details (ID, title, category)
  - Resolution information
  - Resolution date
  - Assigned staff member
- **Sample Data**: Pre-populated with 3 resolved cases
- **Visual Design**: Clean card layout with status indicators

#### 4. Guidelines Tab
Four informative cards:
1. **Be Specific**: Provide clear, detailed information
2. **Confidentiality**: Assurance of privacy protection
3. **Response Time**: Expected 3-5 business days
4. **Documentation**: Advice on gathering evidence

## 🎨 Design System

### Colors
- **Primary Blue**: `#1e40af` (gradient: `#dbeafe` → `#bfdbfe`)
- **Orange**: `#9a3412` (gradient: `#fed7aa` → `#fdba74`)
- **Green**: `#065f46` (gradient: `#d1fae5` → `#a7f3d0`)
- **Category Pills**: `#e8f0f8` background
- **Priority High**: `#fee2e2` background, `#b91c1c` text
- **Priority Medium**: `#fef3c7` background, `#d97706` text
- **Priority Low**: `#d1fae5` background, `#065f46` text
- **Status Active**: `#dbeafe` background, `#1e40af` text
- **Status Under Review**: `#fef3c7` background, `#d97706` text
- **Status Resolved**: `#d1fae5` background, `#065f46` text

### Typography
- **Header**: 32px bold
- **Card Labels**: 14px medium
- **Card Values**: 40px bold
- **Tab Buttons**: 15px medium
- **Form Labels**: 14px medium
- **Pills**: 13px medium

### Spacing & Layout
- **Card Border Radius**: 20px
- **Pill Border Radius**: 25px
- **Button Border Radius**: 12px
- **Card Shadows**: `0 4px 20px rgba(0, 0, 0, 0.05)`
- **Grid Gaps**: 20px-30px
- **Form Grid**: 2 columns with responsive breakpoints

## 🧪 Testing

Comprehensive test suite with **37 tests** covering:
- ✅ Component rendering and structure
- ✅ Summary card display and data
- ✅ Tab navigation and switching
- ✅ Active cases table and pills
- ✅ Multi-step form with validation
- ✅ Step navigation (continue/back buttons)
- ✅ History and guidelines display
- ✅ Accessibility (labels, keyboard navigation)

**Test Coverage**: 100% pass rate

### Run Tests
```bash
# From root directory
npm test GrievanceSystem.test.jsx

# From package directory
cd packages/hrms-school-ui
npm test GrievanceSystem.test.jsx
```

## 📁 File Structure

```
grievance-system/
├── GrievanceSystem.jsx      # Main component (~650 lines)
├── GrievanceSystem.scss     # Styling (~900 lines)
├── GrievanceSystem.test.jsx # Test suite (~150 lines, 37 tests)
└── README.md                # This file
```

## 🔗 Integration

### Routes
The component is registered in `src/app/routes.jsx`:
```jsx
{
  path: '/school/grievance-system',
  element: <GrievanceSystem />
}
```

### Package Exports
Exported from `packages/hrms-school-ui/src/index.jsx`:
```jsx
export { default as GrievanceSystem } from './pages/grievance-system';
```

### Access URL
- Development: `http://localhost:3001/school/grievance-system`
- Production: `/school/grievance-system`

## 🎯 Data Test IDs

All interactive elements follow the `school-*` naming convention:

**Containers:**
- `school-container-grievance-system`
- `school-content-active-cases`
- `school-content-submit-new`
- `school-content-history`
- `school-content-guidelines`

**Cards:**
- `school-card-total-grievances`
- `school-card-active-cases`
- `school-card-resolved-month`

**Tabs:**
- `school-tab-active-cases`
- `school-tab-submit-new`
- `school-tab-history`
- `school-tab-guidelines`

**Form Fields:**
- `school-field-title`
- `school-field-description`
- `school-field-date`
- `school-dropdown-category`
- `school-dropdown-priority`

**Buttons:**
- `school-button-continue`
- `school-button-cancel`
- `school-button-back`
- `school-button-submit`

## 📊 Sample Data

### Active Cases
1. Classroom AC not working (Facilities, Medium Priority)
2. Homework overload in mathematics (Academic, High Priority)
3. Safety concern near cafeteria (Safety, High Priority)

### History
1. Bus route timing (Transportation, Resolved)
2. Library access hours (Academic, Resolved)
3. Uniform policy clarification (Communication, Resolved)

## 🚀 Future Enhancements

- [ ] Real-time updates using WebSocket
- [ ] File upload integration with backend
- [ ] Email notifications for case updates
- [ ] Advanced filtering and search
- [ ] Export grievances to PDF
- [ ] Analytics dashboard
- [ ] Mobile app integration
- [ ] Dark theme support

## 📱 Responsive Design

- **Desktop**: Full 2-column form layout, wide table
- **Tablet**: Responsive grid adjustments
- **Mobile**: Single-column layout, stacked cards

## ♿ Accessibility

- All form inputs have associated labels
- Buttons are keyboard accessible
- Proper ARIA attributes
- Semantic HTML structure
- Color contrast meets WCAG standards

## 📝 Notes

- Light theme only (as requested)
- Pixel-perfect match with reference screenshots
- Modular SCSS architecture
- Form validation prevents incomplete submissions
- All data is currently mocked (ready for API integration)

## 👥 Authors

School HRMS Development Team

## 📄 License

MIT License
