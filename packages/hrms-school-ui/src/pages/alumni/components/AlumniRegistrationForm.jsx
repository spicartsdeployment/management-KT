import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import IndustryDropdown from './IndustryDropdown';

const CURRENT_YEAR = new Date().getFullYear();
const SCHOOL_STREAMS = ['Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Other'];
const DEGREES = ['BTech', 'MTech', 'MBA', 'BCA', 'MCA', 'BSc', 'MSc', 'BCom', 'MCom', 'BA', 'MA', 'PhD', 'Diploma', 'Other'];
const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91' }, { code: '+1',  label: '🇺🇸 +1'  },
  { code: '+44', label: '🇬🇧 +44' }, { code: '+971', label: '🇦🇪 +971' },
  { code: '+65', label: '🇸🇬 +65' }, { code: '+61', label: '🇦🇺 +61'  },
  { code: '+60', label: '🇲🇾 +60' }, { code: '+966', label: '🇸🇦 +966' },
  { code: '+974', label: '🇶🇦 +974' }, { code: '+880', label: '🇧🇩 +880' },
];

const buildDefaults = (passingYear) => ({
  fullName: '', email: '',
  phoneCode: '+91', phoneNumber: '',
  whatsappCode: '+91', whatsappNumber: '', whatsappSameAsPhone: false, receiveWhatsappMessages: false,
  studentId: '', admissionNumber: '', yearOfAdmission: '',
  yearOfPassing: passingYear || '', classSection: '', stream: '', otherStream: '',
  highestDegree: '', eduStream: '', eduYearOfPassing: '', universityName: '', otherDegree: '',
  jobTitle: '', company: '', city: '', stateCountry: '',
  industry: '', otherIndustry: '',
  mainSkill: '', linkedIn: '', availableForMentoring: false,
});

// â”€â”€ Photo Upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PhotoUpload = ({ preview, onFileChange }) => (
  <div className="sch-alu-enroll-field-group sch-alu-enroll-photo-group">
    <label className="sch-alu-enroll-label">Profile Photo</label>
    <div className="sch-alu-enroll-photo-upload">
      <div className="sch-alu-enroll-photo-preview">
        {preview ? <img src={preview} alt="Preview" /> : (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
      <label className="sch-alu-enroll-photo-btn" htmlFor="alu-photo-upload" data-testid="school-field-photo-upload">
        Upload Photo
        <input id="alu-photo-upload" type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
      </label>
    </div>
  </div>
);
PhotoUpload.propTypes = { preview: PropTypes.string, onFileChange: PropTypes.func.isRequired };
PhotoUpload.defaultProps = { preview: null };

// â”€â”€ Section: Basic Information â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// eslint-disable-next-line max-lines-per-function
const BasicInfoSection = ({ register, errors, preview, onPhotoChange }) => (
  <div className="sch-alu-enroll-form-section">
    <h4 className="sch-alu-enroll-section-title">👤 Basic Information</h4>
    <PhotoUpload preview={preview} onFileChange={onPhotoChange} />
    <div className="sch-alu-enroll-grid-2">
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Full Name <span className="sch-alu-enroll-required">*</span></label>
        <input
          className={`sch-alu-enroll-input${errors.fullName ? ' sch-alu-enroll-input--error' : ''}`}
          placeholder="John Doe" data-testid="school-field-full-name"
          {...register('fullName', { required: 'Full name is required.' })}
        />
        {errors.fullName && <span className="sch-alu-enroll-error">{errors.fullName.message}</span>}
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Email <span className="sch-alu-enroll-required">*</span></label>
        <input
          type="email"
          className={`sch-alu-enroll-input${errors.email ? ' sch-alu-enroll-input--error' : ''}`}
          placeholder="john@example.com" data-testid="school-field-email"
          {...register('email', { required: 'Email is required.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email.' } })}
        />
        {errors.email && <span className="sch-alu-enroll-error">{errors.email.message}</span>}
      </div>
    </div>
  </div>
);
BasicInfoSection.propTypes = {
  register: PropTypes.func.isRequired, errors: PropTypes.object.isRequired,
  preview: PropTypes.string, onPhotoChange: PropTypes.func.isRequired,
};
BasicInfoSection.defaultProps = { preview: null };

// â”€â”€ Section: Academic Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ── Section: Contact Details ─────────────────────────────────────────────────────
// eslint-disable-next-line max-lines-per-function
const ContactSection = ({ register, errors, watchWhatsappSame }) => (
  <div className="sch-alu-enroll-form-section">
    <h4 className="sch-alu-enroll-section-title">📞 Contact Details</h4>
    <div className="sch-alu-enroll-grid-2">
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Phone Number <span className="sch-alu-enroll-required">*</span></label>
        <div className="sch-alu-enroll-phone-row">
          <select
            className="sch-alu-enroll-phone-code"
            data-testid="school-select-phone-code"
            {...register('phoneCode')}
          >
            {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
          <input
            type="tel"
            className={`sch-alu-enroll-input${errors.phoneNumber ? ' sch-alu-enroll-input--error' : ''}`}
            placeholder="98765 43210"
            data-testid="school-field-phone"
            {...register('phoneNumber', {
              required: 'Phone number is required.',
              pattern: { value: /^[\d\s\-().]{6,14}$/, message: 'Enter digits only, e.g. 98765 43210.' },
            })}
          />
        </div>
        {errors.phoneNumber && <span className="sch-alu-enroll-error">{errors.phoneNumber.message}</span>}
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">WhatsApp Number</label>
        <label className="sch-alu-enroll-checkbox-label" data-testid="school-label-whatsapp-same">
          <input type="checkbox" className="sch-alu-enroll-checkbox" data-testid="school-checkbox-whatsapp-same" {...register('whatsappSameAsPhone')} />
          <span>Same as phone number</span>
        </label>
        {!watchWhatsappSame && (
          <div className="sch-alu-enroll-phone-row">
            <select
              className="sch-alu-enroll-phone-code"
              data-testid="school-select-whatsapp-code"
              {...register('whatsappCode')}
            >
              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
            <input
              type="tel"
              className={`sch-alu-enroll-input${errors.whatsappNumber ? ' sch-alu-enroll-input--error' : ''}`}
              placeholder="98765 43210"
              data-testid="school-field-whatsapp-number"
              {...register('whatsappNumber', {
                pattern: { value: /^[\d\s\-().]{6,14}$/, message: 'Enter digits only.' },
              })}
            />
          </div>
        )}
        {errors.whatsappNumber && <span className="sch-alu-enroll-error">{errors.whatsappNumber.message}</span>}
      </div>
    </div>
    <div className="sch-alu-enroll-field-group sch-alu-enroll-checkbox-group">
      <label className="sch-alu-enroll-checkbox-label" data-testid="school-label-whatsapp-msgs">
        <input type="checkbox" className="sch-alu-enroll-checkbox" data-testid="school-checkbox-whatsapp-msgs" {...register('receiveWhatsappMessages')} />
        <span>Receive WhatsApp messages from school</span>
      </label>
      <p className="sch-alu-enroll-checkbox-desc">Allow the school to send you updates, events and notifications via WhatsApp.</p>
    </div>
  </div>
);
ContactSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  watchWhatsappSame: PropTypes.bool,
};
ContactSection.defaultProps = { watchWhatsappSame: false };

// ── Section: Academic Details ─────────────────────────────────────────────────────
// eslint-disable-next-line max-lines-per-function
const AcademicSection = ({ register, errors, watchStream }) => (
  <div className="sch-alu-enroll-form-section">
    <h4 className="sch-alu-enroll-section-title">🏫 Academic Details</h4>
    <div className="sch-alu-enroll-grid-2">
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Student ID <span className="sch-alu-enroll-required">*</span></label>
        <input
          className={`sch-alu-enroll-input${errors.studentId ? ' sch-alu-enroll-input--error' : ''}`}
          placeholder="STU1023" data-testid="school-field-student-id"
          {...register('studentId', { required: 'Student ID is required.' })}
        />
        {errors.studentId && <span className="sch-alu-enroll-error">{errors.studentId.message}</span>}
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Admission Number</label>
        <input className="sch-alu-enroll-input" placeholder="ADM2010" data-testid="school-field-admission-number" {...register('admissionNumber')} />
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Year of Admission</label>
        <input
          type="number" min="1970" max={CURRENT_YEAR}
          className="sch-alu-enroll-input" placeholder="2014" data-testid="school-field-year-of-admission"
          {...register('yearOfAdmission', { min: { value: 1970, message: 'Enter a valid year.' }, max: { value: CURRENT_YEAR, message: 'Year cannot be in the future.' } })}
        />
        {errors.yearOfAdmission && <span className="sch-alu-enroll-error">{errors.yearOfAdmission.message}</span>}
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Year of Passing (10th) <span className="sch-alu-enroll-required">*</span></label>
        <input
          type="number" min="1970" max={CURRENT_YEAR}
          className={`sch-alu-enroll-input${errors.yearOfPassing ? ' sch-alu-enroll-input--error' : ''}`}
          data-testid="school-field-year-of-passing"
          {...register('yearOfPassing', { required: 'Year of passing is required.' })}
        />
        {errors.yearOfPassing && <span className="sch-alu-enroll-error">{errors.yearOfPassing.message}</span>}
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Class / Section</label>
        <input className="sch-alu-enroll-input" placeholder="10 - A" data-testid="school-field-class-section" {...register('classSection')} />
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Stream (Optional)</label>
        <select className="sch-alu-enroll-select" data-testid="school-select-stream" {...register('stream')}>
          <option value="">Select Stream</option>
          {SCHOOL_STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {watchStream === 'Other' && (
        <div className="sch-alu-enroll-field-group">
          <label className="sch-alu-enroll-label">Specify Stream <span className="sch-alu-enroll-required">*</span></label>
          <input
            className={`sch-alu-enroll-input${errors.otherStream ? ' sch-alu-enroll-input--error' : ''}`}
            placeholder="Enter your stream" data-testid="school-field-other-stream"
            {...register('otherStream', { required: 'Please specify your stream.' })}
          />
          {errors.otherStream && <span className="sch-alu-enroll-error">{errors.otherStream.message}</span>}
        </div>
      )}
    </div>
  </div>
);
AcademicSection.propTypes = {
  register: PropTypes.func.isRequired, errors: PropTypes.object.isRequired, watchStream: PropTypes.string,
};
AcademicSection.defaultProps = { watchStream: '' };

// â”€â”€ Section: Highest Education â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// eslint-disable-next-line max-lines-per-function
const HighestEducationSection = ({ register, errors, watchDegree }) => (
  <div className="sch-alu-enroll-form-section">
    <h4 className="sch-alu-enroll-section-title">🎓 Highest Education</h4>
    <div className="sch-alu-enroll-grid-2">
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Degree / Qualification <span className="sch-alu-enroll-required">*</span></label>
        <select
          className={`sch-alu-enroll-select${errors.highestDegree ? ' sch-alu-enroll-input--error' : ''}`}
          data-testid="school-select-highest-degree"
          {...register('highestDegree', { required: 'Please select your highest degree.' })}
        >
          <option value="">Select Degree</option>
          {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {errors.highestDegree && <span className="sch-alu-enroll-error">{errors.highestDegree.message}</span>}
      </div>
      {watchDegree === 'Other' && (
        <div className="sch-alu-enroll-field-group">
          <label className="sch-alu-enroll-label">Specify Degree <span className="sch-alu-enroll-required">*</span></label>
          <input
            className={`sch-alu-enroll-input${errors.otherDegree ? ' sch-alu-enroll-input--error' : ''}`}
            placeholder="e.g. BPharm, LLB" data-testid="school-field-other-degree"
            {...register('otherDegree', { required: 'Please specify your degree.' })}
          />
          {errors.otherDegree && <span className="sch-alu-enroll-error">{errors.otherDegree.message}</span>}
        </div>
      )}
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Stream / Specialization</label>
        <input
          className="sch-alu-enroll-input"
          placeholder="e.g. Computer Science, Finance" data-testid="school-field-edu-stream"
          {...register('eduStream')}
        />
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Year of Passing <span className="sch-alu-enroll-required">*</span></label>
        <input
          type="number" min="1970" max={CURRENT_YEAR + 5}
          className={`sch-alu-enroll-input${errors.eduYearOfPassing ? ' sch-alu-enroll-input--error' : ''}`}
          placeholder={String(CURRENT_YEAR)} data-testid="school-field-edu-year-of-passing"
          {...register('eduYearOfPassing', { required: 'Year of passing is required.', min: { value: 1970, message: 'Enter a valid year.' } })}
        />
        {errors.eduYearOfPassing && <span className="sch-alu-enroll-error">{errors.eduYearOfPassing.message}</span>}
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">University / Institution <span className="sch-alu-enroll-required">*</span></label>
        <input
          className={`sch-alu-enroll-input${errors.universityName ? ' sch-alu-enroll-input--error' : ''}`}
          placeholder="e.g. Delhi University, IIT Bombay" data-testid="school-field-university-name"
          {...register('universityName', { required: 'University name is required.' })}
        />
        {errors.universityName && <span className="sch-alu-enroll-error">{errors.universityName.message}</span>}
      </div>
    </div>
  </div>
);
HighestEducationSection.propTypes = {
  register: PropTypes.func.isRequired, errors: PropTypes.object.isRequired, watchDegree: PropTypes.string,
};
HighestEducationSection.defaultProps = { watchDegree: '' };

// â”€â”€ Section: Professional Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// eslint-disable-next-line max-lines-per-function
const ProfessionalSection = ({ register, errors, control, watchIndustry }) => (
  <div className="sch-alu-enroll-form-section">
    <h4 className="sch-alu-enroll-section-title">💼 Professional Details</h4>
    <div className="sch-alu-enroll-grid-2">
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Job Title</label>
        <input className="sch-alu-enroll-input" placeholder="Software Engineer" data-testid="school-field-job-title" {...register('jobTitle')} />
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Company / Organization</label>
        <input className="sch-alu-enroll-input" placeholder="Google" data-testid="school-field-company" {...register('company')} />
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">City</label>
        <input className="sch-alu-enroll-input" placeholder="Bangalore" data-testid="school-field-city" {...register('city')} />
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">State / Country</label>
        <input className="sch-alu-enroll-input" placeholder="India" data-testid="school-field-state-country" {...register('stateCountry')} />
      </div>
    </div>
    <Controller
      name="industry" control={control} rules={{ required: 'Please select an industry.' }}
      render={({ field, fieldState }) => (
        <IndustryDropdown value={field.value} onChange={field.onChange} error={fieldState.error} />
      )}
    />
    {watchIndustry === 'Other' && (
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Specify Industry <span className="sch-alu-enroll-required">*</span></label>
        <input
          className={`sch-alu-enroll-input${errors.otherIndustry ? ' sch-alu-enroll-input--error' : ''}`}
          placeholder="Enter your industry" data-testid="school-field-other-industry"
          {...register('otherIndustry', { validate: v => watchIndustry !== 'Other' || !!v || 'Please specify your industry.' })}
        />
        {errors.otherIndustry && <span className="sch-alu-enroll-error">{errors.otherIndustry.message}</span>}
      </div>
    )}
  </div>
);
ProfessionalSection.propTypes = {
  register: PropTypes.func.isRequired, errors: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired, watchIndustry: PropTypes.string,
};
ProfessionalSection.defaultProps = { watchIndustry: '' };

// â”€â”€ Section: Expertise & Online Presence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// eslint-disable-next-line max-lines-per-function
const ExpertiseSection = ({ register, errors }) => (
  <div className="sch-alu-enroll-form-section">
    <h4 className="sch-alu-enroll-section-title">⭐ Expertise &amp; Online Presence</h4>
    <div className="sch-alu-enroll-grid-2">
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">Primary Skill / Expertise <span className="sch-alu-enroll-required">*</span></label>
        <input
          className={`sch-alu-enroll-input${errors.mainSkill ? ' sch-alu-enroll-input--error' : ''}`}
          placeholder="e.g. Full-Stack Development, Financial Analysis"
          data-testid="school-field-main-skill"
          {...register('mainSkill', { required: 'Please enter your primary skill.' })}
        />
        {errors.mainSkill && <span className="sch-alu-enroll-error">{errors.mainSkill.message}</span>}
      </div>
      <div className="sch-alu-enroll-field-group">
        <label className="sch-alu-enroll-label">LinkedIn Profile URL</label>
        <input
          type="url"
          className={`sch-alu-enroll-input${errors.linkedIn ? ' sch-alu-enroll-input--error' : ''}`}
          placeholder="https://linkedin.com/in/johndoe" data-testid="school-field-linkedin"
          {...register('linkedIn', { pattern: { value: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/, message: 'Enter a valid LinkedIn URL.' } })}
        />
        {errors.linkedIn && <span className="sch-alu-enroll-error">{errors.linkedIn.message}</span>}
      </div>
    </div>
    <div className="sch-alu-enroll-field-group sch-alu-enroll-checkbox-group">
      <label className="sch-alu-enroll-checkbox-label" data-testid="school-label-mentoring">
        <input type="checkbox" className="sch-alu-enroll-checkbox" data-testid="school-checkbox-mentoring" {...register('availableForMentoring')} />
        <span>Available for Mentoring</span>
      </label>
      <p className="sch-alu-enroll-checkbox-desc">Let students reach out to you for career guidance.</p>
    </div>
  </div>
);
ExpertiseSection.propTypes = { register: PropTypes.func.isRequired, errors: PropTypes.object.isRequired };

// â”€â”€ Form Submit Button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FormActions = ({ isSubmitting, isValid }) => (
  <div className="sch-alu-enroll-form-actions">
    <p className="sch-alu-enroll-form-actions-hint">
      {isValid ? '🎉 All set! Ready to join the alumni family.' : '✏️ Fill in all required fields to continue.'}
    </p>
    <button
      type="submit"
      className="sch-alu-enroll-btn-submit"
      disabled={isSubmitting || !isValid}
      data-testid="school-button-submit-enrollment"
    >
      {isSubmitting ? '✨ Submitting...' : '🎓 Submit Enrollment'}
    </button>
  </div>
);
FormActions.propTypes = { isSubmitting: PropTypes.bool, isValid: PropTypes.bool };
FormActions.defaultProps = { isSubmitting: false, isValid: false };

// ── Main Form Component ────────────────────────────────────────────────────────
/**
 * AlumniRegistrationForm – Step 3: full alumni details using react-hook-form
 * @param {function} onSubmit - callback with form data
 * @param {string} enrollmentType - 'self' | 'other'
 * @param {number} passingYear - pre-filled from eligibility step
 * @param {object|null} initialData - existing enrollment record when editing
 */
const AlumniRegistrationForm = ({ onSubmit, enrollmentType, passingYear, initialData }) => {
  const [photoPreview, setPhotoPreview] = useState(initialData?.photo || null);
  const defaultValues = initialData
    ? { ...buildDefaults(passingYear), ...initialData }
    : buildDefaults(passingYear);
  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting, isValid } } = useForm({ defaultValues, mode: 'onChange' });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = (data) => onSubmit({ ...data, photo: photoPreview, enrollmentType, status: 'pending' });

  return (
    <form className="sch-alu-enroll-form" onSubmit={handleSubmit(submitHandler)} data-testid="school-form-alumni-registration" noValidate>
      <BasicInfoSection register={register} errors={errors} preview={photoPreview} onPhotoChange={handlePhotoChange} />
      <ContactSection register={register} errors={errors} watchWhatsappSame={watch('whatsappSameAsPhone')} />
      <AcademicSection register={register} errors={errors} watchStream={watch('stream')} />
      <HighestEducationSection register={register} errors={errors} watchDegree={watch('highestDegree')} />
      <ProfessionalSection register={register} errors={errors} control={control} watchIndustry={watch('industry')} />
      <ExpertiseSection register={register} errors={errors} />
      <FormActions isSubmitting={isSubmitting} isValid={isValid} />
    </form>
  );
};

AlumniRegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  enrollmentType: PropTypes.string,
  passingYear: PropTypes.number,
  initialData: PropTypes.object,
};
AlumniRegistrationForm.defaultProps = { enrollmentType: 'self', passingYear: null, initialData: null };

export default AlumniRegistrationForm;
