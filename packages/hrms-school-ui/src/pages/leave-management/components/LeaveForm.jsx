
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { leaveTypes, leaveGuidelines } from '../constants';
import CustomDropdown from './CustomDropdown';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { submitLeaveRequest } from '../../../services/leave.api';

function validateEmergencyContact(value) {
  if (!value) return "";
  if (!/^\d{10}$/.test(value)) return "Phone number must be exactly 10 digits.";
  if (!/^[9876]/.test(value)) return "Wrong number. Phone number must start with 9, 8, 7, or 6.";
  return "";
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function dateToString(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function LeaveTypeFields({ formData, isSickLeave, handleChange }) {
  return (
    <>
      <div className="sch-lm-form-group">
        <label htmlFor="leaveType">Leave Type</label>
        <CustomDropdown
          id="leaveType" name="leaveType" value={formData.leaveType}
          onChange={handleChange} testId="school-dropdown-leave-type"
          placeholder="Select Leave Type"
          options={[{ value: '', label: 'Select Leave Type' }, ...leaveTypes.map(t => ({ value: t, label: t }))]}
        />
      </div>
      <div className={`sch-lm-form-group ${!isSickLeave ? 'sch-lm-disabled-field' : ''}`}>
        <label htmlFor="sickLeaveType">Sick Leave Type</label>
        <CustomDropdown
          id="sickLeaveType" name="sickLeaveType" value={formData.sickLeaveType}
          onChange={handleChange} disabled={!isSickLeave} testId="school-dropdown-sick-leave-type"
          placeholder="Select Sick Leave Type"
          options={[
            { value: '', label: 'Select Sick Leave Type' }, { value: 'cold', label: 'Cold/Flu' },
            { value: 'stomach', label: 'Stomach Infection' }, { value: 'headache', label: 'Headache' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </div>
    </>
  );
}

LeaveTypeFields.propTypes = {
  formData: PropTypes.object.isRequired,
  isSickLeave: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

function DateAndMedicalFields({ formData, isSickLeave, leaveDuration, handleChange }) {
  return (
    <>
      <div className="sch-lm-form-row">
        <div className="sch-lm-form-group">
          <label htmlFor="startDate">Start Date</label>
          <CustomDatePicker id="startDate" name="startDate" value={formData.startDate}
            onChange={handleChange} min={getTodayDate()} placeholder="Select start date"
            required testId="school-input-start-date" />
        </div>
        <div className="sch-lm-form-group">
          <label htmlFor="endDate">End Date</label>
          <CustomDatePicker id="endDate" name="endDate" value={formData.endDate}
            onChange={handleChange} min={formData.startDate || getTodayDate()}
            placeholder="Select end date" required testId="school-input-end-date" />
        </div>
      </div>
      <div className={`sch-lm-form-group ${!(isSickLeave && leaveDuration > 2) ? 'sch-lm-disabled-field' : ''}`}>
        <label htmlFor="medicalCertificate">Upload Medical Certificate</label>
        <input type="file" id="medicalCertificate" name="medicalCertificate"
          accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange}
          disabled={!(isSickLeave && leaveDuration > 2)}
          data-testid="school-input-medical-certificate" />
      </div>
    </>
  );
}

DateAndMedicalFields.propTypes = {
  formData: PropTypes.object.isRequired,
  isSickLeave: PropTypes.bool.isRequired,
  leaveDuration: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};

function ReasonAndContactFields({ formData, emergencyContactError, handleChange }) {
  return (
    <>
      <div className="sch-lm-form-group">
        <label htmlFor="reason">Reason for Leave</label>
        <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange}
          placeholder="Please provide additional details about your leave..." rows="2"
          required data-testid="school-textarea-reason" />
      </div>
      <div className="sch-lm-form-group">
        <label htmlFor="emergencyContact">Emergency Contact</label>
        <input type="tel" id="emergencyContact" name="emergencyContact"
          value={formData.emergencyContact} onChange={handleChange}
          placeholder="Enter emergency contact number" data-testid="school-input-emergency-contact" />
        {emergencyContactError && (
          <div className="sch-lm-error-text" data-testid="school-error-emergency-contact">{emergencyContactError}</div>
        )}
      </div>
    </>
  );
}

ReasonAndContactFields.propTypes = {
  formData: PropTypes.object.isRequired,
  emergencyContactError: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

function CheckboxFields({ formData, isSingleDay, isAffirmationEnabled, handleChange }) {
  return (
    <>
      <div className="sch-lm-form-group">
        <label htmlFor="halfDay">
          <input type="checkbox" id="halfDay" name="halfDay" checked={formData.halfDay}
            onChange={handleChange} disabled={!isSingleDay} data-testid="school-checkbox-half-day" />
          Half Day (Otherwise Full Day)
        </label>
      </div>
      <div className="sch-lm-form-group">
        <label htmlFor="affirmation">
          <input type="checkbox" id="affirmation" name="affirmation" checked={formData.affirmation}
            onChange={handleChange} disabled={!isAffirmationEnabled} data-testid="school-checkbox-affirmation" />
          I affirm that the information provided is accurate
        </label>
      </div>
    </>
  );
}

CheckboxFields.propTypes = {
  formData: PropTypes.object.isRequired,
  isSingleDay: PropTypes.bool.isRequired,
  isAffirmationEnabled: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

function LeaveGuidelinesBox() {
  return (
    <div className="sch-lm-guidelines-container" data-testid="school-container-leave-guidelines">
      <div className="sch-lm-guidelines-header">
        <span className="sch-lm-guidelines-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
          </svg>
        </span>
        <span className="sch-lm-guidelines-title">Leave Guidelines</span>
      </div>
      <ul className="sch-lm-guidelines-list">
        {leaveGuidelines.map((guideline, index) => <li key={index}>{guideline}</li>)}
      </ul>
    </div>
  );
}

function buildHandleChange(setFormData, setEmergencyContactError) {
  return (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "emergencyContact") setEmergencyContactError(validateEmergencyContact(value));
    if (type === "checkbox") { setFormData(prev => ({ ...prev, [name]: checked })); return; }
    if (type === "file") { setFormData(prev => ({ ...prev, [name]: files[0] })); return; }
    if (name === "leaveType") { setFormData(prev => ({ ...prev, [name]: value, sickLeaveType: "" })); return; }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
}

function checkAffirmationEnabled(formData, isSickLeave, emergencyContactError) {
  return !!(formData.leaveType && (!isSickLeave || formData.sickLeaveType) &&
    formData.startDate && formData.endDate && formData.reason &&
    formData.emergencyContact && emergencyContactError === "");
}

function computeFormState(formData, emergencyContactError) {
  const isSickLeave = formData.leaveType === "Sick Leave";
  const isSingleDay = !!(formData.startDate && formData.endDate && formData.startDate === formData.endDate);
  const leaveDuration = (formData.startDate && formData.endDate)
    ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / 86400000) + 1 : 0;
  const isAffirmationEnabled = checkAffirmationEnabled(formData, isSickLeave, emergencyContactError);
  return { isSickLeave, isSingleDay, leaveDuration, isAffirmationEnabled };
}

function SubmitButton({ isSubmitEnabled }) {
  return (
    <button type="submit" className="sch-lm-submit-button" data-testid="school-button-submit-leave" disabled={!isSubmitEnabled}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
      Submit Application
    </button>
  );
}

SubmitButton.propTypes = { isSubmitEnabled: PropTypes.bool.isRequired };

const INITIAL_FORM_DATA = {
  leaveType: "", sickLeaveType: "", startDate: "", startTime: "09", startMinute: "00",
  endDate: "", endTime: "00", endMinute: "00", reason: "", emergencyContact: "",
  specificReason: "", medicalCertificate: null, halfDay: false, affirmation: false,
};

function syncDatesFromRange(selectedRange, setFormData) {
  if (selectedRange.start) setFormData(prev => ({ ...prev, startDate: dateToString(selectedRange.start) }));
  if (selectedRange.end) setFormData(prev => ({ ...prev, endDate: dateToString(selectedRange.end) }));
}

function buildSubmitPayload(formData, sessionParams) {
  return {
    studentId: sessionParams.studentId,
    schoolId: sessionParams.schoolId,
    branchId: sessionParams.branchId,
    classId: sessionParams.classId,
    teacherId: sessionParams.teacherId,
    leaveType: formData.leaveType,
    startDate: formData.startDate,
    endDate: formData.endDate,
    reasonForLeave: formData.reason,
    leaveTitle: `${formData.leaveType} - ${formData.reason.slice(0, 30)}`,
    submittedByName: sessionParams.submittedByName,
    submittedByRole: sessionParams.submittedByRole,
    halfDay: formData.halfDay,
  };
}

async function doSubmit({ formData, sessionParams, setIsSubmitting, setSubmitMessage, setFormData }) {
  setIsSubmitting(true);
  setSubmitMessage(null);
  try {
    // FUTURE: when backend is stable, this is the only branch that runs.
    // Remove the catch isNetworkError block below — no other changes needed.
    const result = await submitLeaveRequest(buildSubmitPayload(formData, sessionParams));
    const leaveId = result?.leaveId ? ` (Leave #${result.leaveId})` : '';
    setSubmitMessage({ type: 'success', text: `Leave application submitted successfully!${leaveId}` });
    setFormData(INITIAL_FORM_DATA);
  } catch (err) {
    if (isNetworkError(err)) {
      // API server unreachable — show error message
      setSubmitMessage({ type: 'error', text: 'Network error: Unable to submit leave request. Please check your connection and try again.' });
    } else {
      const msg = err?.response?.data?.error || err.message || 'Failed to submit leave request';
      setSubmitMessage({ type: 'error', text: msg });
    }
  } finally {
    setIsSubmitting(false);
  }
}

function SubmitMessageBanner({ submitMessage = null }) {
  if (!submitMessage) return null;
  return (
    <div className={`sch-lm-submit-message sch-lm-submit-${submitMessage.type}`} data-testid={`school-message-submit-${submitMessage.type}`}>
      {submitMessage.text}
    </div>
  );
}

SubmitMessageBanner.propTypes = { submitMessage: PropTypes.shape({ type: PropTypes.string, text: PropTypes.string }) };

export default function LeaveForm({ selectedRange, setSelectedRange: _setSelectedRange, sessionParams = { studentId: null, schoolId: null, branchId: null, classId: null, teacherId: null, submittedByName: '', submittedByRole: '' } }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [emergencyContactError, setEmergencyContactError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => { syncDatesFromRange(selectedRange, setFormData); }, [selectedRange]);

  const handleChange = buildHandleChange(setFormData, setEmergencyContactError);
  const { isSickLeave, isSingleDay, leaveDuration, isAffirmationEnabled } = computeFormState(formData, emergencyContactError);
  const isSubmitEnabled = isAffirmationEnabled && formData.affirmation && !isSubmitting;
  const handleSubmit = (e) => { e.preventDefault(); if (isSubmitEnabled) doSubmit({ formData, sessionParams, setIsSubmitting, setSubmitMessage, setFormData }); };

  return (
    <div className="sch-lm-form-container" data-testid="school-container-leave-form">
      <div className="sch-lm-form-header"><h3>Apply for Leave</h3></div>
      <SubmitMessageBanner submitMessage={submitMessage} />
      <form onSubmit={handleSubmit} className="sch-lm-form">
        <LeaveTypeFields formData={formData} isSickLeave={isSickLeave} handleChange={handleChange} />
        <DateAndMedicalFields formData={formData} isSickLeave={isSickLeave} leaveDuration={leaveDuration} handleChange={handleChange} />
        <ReasonAndContactFields formData={formData} emergencyContactError={emergencyContactError} handleChange={handleChange} />
        <CheckboxFields formData={formData} isSingleDay={isSingleDay} isAffirmationEnabled={isAffirmationEnabled} handleChange={handleChange} />
        <SubmitButton isSubmitEnabled={isSubmitEnabled} />
        <LeaveGuidelinesBox />
      </form>
    </div>
  );
}

LeaveForm.propTypes = {
  selectedRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }).isRequired,
  setSelectedRange: PropTypes.func.isRequired,
  sessionParams: PropTypes.shape({
    studentId: PropTypes.number,
    schoolId: PropTypes.number,
    branchId: PropTypes.number,
    classId: PropTypes.number,
    teacherId: PropTypes.number,
    submittedByName: PropTypes.string,
    submittedByRole: PropTypes.string,
  }),
};
