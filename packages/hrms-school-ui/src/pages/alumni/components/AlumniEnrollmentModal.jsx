import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EnrollmentStepper from './EnrollmentStepper';
import EnrollmentTypeStep from './EnrollmentTypeStep';
import EligibilityCheckStep from './EligibilityCheckStep';
import AlumniRegistrationForm from './AlumniRegistrationForm';
import EnrolledAlumniList from './EnrolledAlumniList';
import { getSessionParams } from '../../../config/sessionParams';

const DEMO_ENROLLMENT = {
  studentId: null,
  enrollmentType: 'self',
  fullName: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 98765 43210',
  yearOfPassing: 2018,
  jobTitle: 'Senior Product Manager',
  company: 'Razorpay',
  city: 'Bengaluru',
  stateCountry: 'India',
  industry: 'FinTech',
  mainSkill: 'Product Strategy',
  highestDegree: 'MBA',
  universityName: 'IIM Ahmedabad',
  availableForMentoring: true,
  linkedIn: 'https://linkedin.com/in/priyasharma',
  status: 'approved',
};

/**
 * AlumniEnrollmentModal – Inline 3-step alumni enrollment panel
 * @param {function} onCollapse - hides the panel from the parent
 */
// eslint-disable-next-line max-lines-per-function
const AlumniEnrollmentModal = ({ onCollapse }) => {
  // ── Stepper state ───────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [enrollmentType, setEnrollmentType] = useState(null);   // 'self' | 'other'
  const [passingYear, setPassingYear] = useState(null);

  // ── Enrollments list ────────────────────────────────────────
  const [enrollments, setEnrollments] = useState(() => {
    const { studentId } = getSessionParams();
    return [{ ...DEMO_ENROLLMENT, studentId: studentId ?? 'demo-001' }];
  });
  const [editingRecord, setEditingRecord] = useState(null);

  // ── Toast ───────────────────────────────────────────────────
  const [toast, setToast] = useState(null); // { type, message }

  // Whether user has already enrolled themselves
  const hasSelfEnrollment = enrollments.some(e => e.enrollmentType === 'self');

  // ── Auto-dismiss toast ───────────────────────────────────────
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ── Navigation helpers ───────────────────────────────────────
  const resetWizard = () => {
    setCurrentStep(1);
    setEnrollmentType(null);
    setPassingYear(null);
    setEditingRecord(null);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  // Step 1: type selected → advance
  const handleTypeSelect = (type) => {
    setEnrollmentType(type);
    setCurrentStep(2);
  };

  // Step 2: eligibility confirmed → advance with year
  const handleEligible = (year) => {
    setPassingYear(year);
    // Slight delay so the success alert is readable
    setTimeout(() => setCurrentStep(3), 800);
  };

  // Step 3: form submitted
  const handleFormSubmit = (data) => {
    if (editingRecord) {
      // Replace existing pending record
      setEnrollments(prev =>
        prev.map(e => e === editingRecord ? { ...data, status: 'pending' } : e)
      );
      setEditingRecord(null);
    } else {
      setEnrollments(prev => [...prev, { ...data, status: 'pending' }]);
    }
    setToast({ type: 'success', message: 'Enrollment submitted successfully. Awaiting admin verification.' });
    resetWizard();
  };

  // Edit pending enrollment – prefill uses the form's defaultValues mechanism
  const handleEdit = (record) => {
    setEditingRecord(record);
    setEnrollmentType(record.enrollmentType);
    setPassingYear(record.yearOfPassing);
    setCurrentStep(3);
  };

  const handleDelete = (record) => {
    setEnrollments(prev => prev.filter(e => e !== record));
  };

  return (
    <div className="sch-alu-enroll-panel" data-testid="school-panel-alumni-enrollment">
        {/* ── Panel Header ── */}
        <div className="sch-alu-enroll-modal-header">
          <div>
            <h2 className="sch-alu-enroll-modal-title">Alumni Enrollment</h2>
            <p className="sch-alu-enroll-modal-subtitle">Join the alumni network in a few easy steps</p>
          </div>
          <button
            className="sch-alu-page-btn-join"
            onClick={onCollapse}
            aria-label="Go back"
            data-testid="school-button-close-enrollment-modal"
          >
            Back
          </button>
        </div>

        {/* ── Stepper ── */}
        <div className="sch-alu-enroll-stepper-wrapper">
          <EnrollmentStepper currentStep={currentStep} />
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div
            className={`sch-alu-enroll-toast sch-alu-enroll-toast--${toast.type}`}
            role="status"
            data-testid="school-toast-enrollment"
          >
            {toast.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="sch-alu-enroll-toast-close" aria-label="Dismiss">×</button>
          </div>
        )}

        {/* ── Wizard Body ── */}
        <div className="sch-alu-enroll-modal-body">
          {/* Step 1 */}
          {currentStep === 1 && (
            <EnrollmentTypeStep
              selected={enrollmentType}
              onSelect={handleTypeSelect}
              hasSelfEnrollment={hasSelfEnrollment}
            />
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <EligibilityCheckStep onEligible={handleEligible} />
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <AlumniRegistrationForm
              onSubmit={handleFormSubmit}
              enrollmentType={enrollmentType}
              passingYear={passingYear}
              initialData={editingRecord}
            />
          )}

          {/* Navigation: Back button (not on step 1) */}
          {currentStep > 1 && currentStep < 3 && (
            <div className="sch-alu-enroll-nav-back">
              <button
                type="button"
                className="sch-alu-page-btn-join"
                onClick={goBack}
                data-testid="school-button-back-step"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 1: Next button enabled only if type selected */}
          {currentStep === 1 && enrollmentType && (
            <div className="sch-alu-enroll-nav-next">
              <button
                type="button"
                className="sch-alu-enroll-btn-primary"
                onClick={() => setCurrentStep(2)}
                data-testid="school-button-next-step"
              >
                Continue →
              </button>
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="sch-alu-enroll-modal-divider" />

        {/* ── Enrollments Dashboard ── */}
        <div className="sch-alu-enroll-modal-dashboard">
          <EnrolledAlumniList enrollments={enrollments} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    </div>
  );
};

AlumniEnrollmentModal.propTypes = { onCollapse: PropTypes.func.isRequired };

export default AlumniEnrollmentModal;
