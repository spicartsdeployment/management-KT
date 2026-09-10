import React, { useState } from 'react'
import '../../assets/scss/FeeManagement.scss'
import CustomDropdown from './components/CustomDropdown'
import PageLoader from '../../components/PageLoader'
import PaymentModal from './components/PaymentModal'

const FeeManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedFeeType, setSelectedFeeType] = useState('Hostel Fee')
  const [selectedAmount, setSelectedAmount] = useState(10000)

  // Fee breakdown data with categories
  const feeBreakdownData = [
    {
      id: 1,
      feeType: 'Tuition Fee - Term 1',
      category: 'Tuition Fees',
      description: 'First term tuition fee covering academic instruction, classroom resources, and course materials',
      amount: 15000,
      paid: 15000,
      dueDate: '15 Apr 2025',
      paidDate: '10 Apr 2025',
      status: 'paid'
    },
    {
      id: 2,
      feeType: 'Tuition Fee - Term 2',
      category: 'Tuition Fees',
      description: 'Second term tuition fee covering academic instruction and learning materials',
      amount: 15000,
      paid: 15000,
      dueDate: '15 Jul 2025',
      paidDate: '12 Jul 2025',
      status: 'paid'
    },
    {
      id: 3,
      feeType: 'Tuition Fee - Term 3',
      category: 'Tuition Fees',
      description: 'Third term tuition fee covering academic instruction and course materials',
      amount: 15000,
      paid: 15000,
      dueDate: '15 Oct 2025',
      paidDate: '14 Oct 2025',
      status: 'paid'
    },
    {
      id: 4,
      feeType: 'Tuition Fee - Term 4',
      category: 'Tuition Fees',
      description: 'Fourth term tuition fee covering academic instruction and examination preparation',
      amount: 15000,
      paid: 0,
      dueDate: '15 Jan 2026',
      paidDate: '—',
      status: 'pending'
    },
    {
      id: 5,
      feeType: 'Hostel Accommodation - Semester 1',
      category: 'Hostel Fees',
      description: 'First semester accommodation charges including room, electricity, and maintenance',
      amount: 22500,
      paid: 22500,
      dueDate: '05 Apr 2025',
      paidDate: '01 Apr 2025',
      status: 'paid'
    },
    {
      id: 6,
      feeType: 'Hostel Accommodation - Semester 2',
      category: 'Hostel Fees',
      description: 'Second semester accommodation charges including room facilities and utilities',
      amount: 22500,
      paid: 12500,
      dueDate: '05 Oct 2025',
      paidDate: '—',
      status: 'pending'
    },
    {
      id: 7,
      feeType: 'Mess Charges - October',
      category: 'Mess Fees',
      description: 'Monthly mess charges covering breakfast, lunch, dinner, and snacks',
      amount: 4500,
      paid: 4500,
      dueDate: '01 Oct 2025',
      paidDate: '30 Sep 2025',
      status: 'paid'
    },
    {
      id: 8,
      feeType: 'Mess Charges - November',
      category: 'Mess Fees',
      description: 'Monthly mess charges covering all meals and refreshments',
      amount: 4500,
      paid: 4500,
      dueDate: '01 Nov 2025',
      paidDate: '31 Oct 2025',
      status: 'paid'
    },
    {
      id: 9,
      feeType: 'Mess Charges - December',
      category: 'Mess Fees',
      description: 'Monthly mess charges covering all meals and beverage services',
      amount: 4500,
      paid: 0,
      dueDate: '01 Dec 2025',
      paidDate: '—',
      status: 'pending'
    },
    {
      id: 10,
      feeType: 'Transportation Fee - Quarter 1',
      category: 'Transport Fees',
      description: 'First quarter bus transportation charges for Route 7A covering April to June',
      amount: 4500,
      paid: 4500,
      dueDate: '05 Apr 2025',
      paidDate: '03 Apr 2025',
      status: 'paid'
    },
    {
      id: 11,
      feeType: 'Transportation Fee - Quarter 2',
      category: 'Transport Fees',
      description: 'Second quarter bus transportation charges covering July to September',
      amount: 4500,
      paid: 4500,
      dueDate: '05 Jul 2025',
      paidDate: '02 Jul 2025',
      status: 'paid'
    },
    {
      id: 12,
      feeType: 'Transportation Fee - Quarter 3',
      category: 'Transport Fees',
      description: 'Third quarter bus transportation charges covering October to December',
      amount: 4500,
      paid: 4500,
      dueDate: '05 Oct 2025',
      paidDate: '04 Oct 2025',
      status: 'paid'
    },
    {
      id: 13,
      feeType: 'Sports Fee',
      category: 'Others',
      description: 'Annual sports activity fee covering gymnasium access, sports equipment, and coaching sessions',
      amount: 3000,
      paid: 3000,
      dueDate: '05 May 2025',
      paidDate: '01 May 2025',
      status: 'paid'
    },
    {
      id: 14,
      feeType: 'Event Fee',
      category: 'Others',
      description: 'Annual cultural and technical event participation charges including competitions and fests',
      amount: 2000,
      paid: 2000,
      dueDate: '15 Aug 2025',
      paidDate: '10 Aug 2025',
      status: 'paid'
    },
    {
      id: 15,
      feeType: 'ID Card & Uniform',
      category: 'Others',
      description: 'Student ID card issuance and uniform set including blazer, tie, and school badge',
      amount: 2000,
      paid: 2000,
      dueDate: '01 Apr 2025',
      paidDate: '28 Mar 2025',
      status: 'paid'
    },
    {
      id: 16,
      feeType: 'Laboratory Fee',
      category: 'Others',
      description: 'Annual laboratory usage charges covering physics, chemistry, and biology lab equipment',
      amount: 5000,
      paid: 5000,
      dueDate: '20 Apr 2025',
      paidDate: '18 Apr 2025',
      status: 'paid'
    },
    {
      id: 17,
      feeType: 'Library Fee',
      category: 'Others',
      description: 'Annual library membership fee including book borrowing facility and digital resources',
      amount: 1500,
      paid: 1500,
      dueDate: '10 Apr 2025',
      paidDate: '08 Apr 2025',
      status: 'paid'
    },
    {
      id: 18,
      feeType: 'Examination Fee - Mid Term',
      category: 'Others',
      description: 'Mid-term examination charges covering question paper, evaluation, and result processing',
      amount: 2500,
      paid: 2500,
      dueDate: '25 Aug 2025',
      paidDate: '22 Aug 2025',
      status: 'paid'
    },
    {
      id: 19,
      feeType: 'Examination Fee - Final',
      category: 'Others',
      description: 'Final examination charges including hall ticket, answer sheet evaluation, and certificate issuance',
      amount: 3500,
      paid: 0,
      dueDate: '15 Dec 2025',
      paidDate: '—',
      status: 'overdue'
    },
    {
      id: 20,
      feeType: 'Computer Lab Fee',
      category: 'Others',
      description: 'Annual computer laboratory charges including internet access, software licenses, and printing',
      amount: 4000,
      paid: 4000,
      dueDate: '30 Apr 2025',
      paidDate: '27 Apr 2025',
      status: 'paid'
    },
    {
      id: 21,
      feeType: 'Activity Fee',
      category: 'Others',
      description: 'Annual extracurricular activity charges covering clubs, societies, and hobby classes',
      amount: 1800,
      paid: 1800,
      dueDate: '10 May 2025',
      paidDate: '08 May 2025',
      status: 'paid'
    },
    {
      id: 22,
      feeType: 'Medical & Insurance',
      category: 'Others',
      description: 'Annual student health insurance and medical facility charges covering emergency services',
      amount: 2200,
      paid: 2200,
      dueDate: '20 Apr 2025',
      paidDate: '17 Apr 2025',
      status: 'paid'
    },
    {
      id: 23,
      feeType: 'Annual Day Contribution',
      category: 'Others',
      description: 'Annual day celebration and cultural program participation charges',
      amount: 1000,
      paid: 0,
      dueDate: '10 Nov 2025',
      paidDate: '—',
      status: 'overdue'
    },
    {
      id: 24,
      feeType: 'Stationery & Books',
      category: 'Others',
      description: 'Academic year textbooks, workbooks, and essential stationery supplies',
      amount: 3500,
      paid: 3500,
      dueDate: '15 Apr 2025',
      paidDate: '12 Apr 2025',
      status: 'paid'
    },
    {
      id: 25,
      feeType: 'Development Fund',
      category: 'Others',
      description: 'Annual infrastructure development and campus improvement contribution',
      amount: 5000,
      paid: 5000,
      dueDate: '30 May 2025',
      paidDate: '28 May 2025',
      status: 'paid'
    }
  ]

  // Filter fee breakdown data based on selected category
  const filteredFeeBreakdown = selectedCategory === 'All Categories'
    ? feeBreakdownData
    : feeBreakdownData.filter(fee => fee.category === selectedCategory)

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'paid': return 'sch-fm-paid-status'
      case 'pending': return 'sch-fm-pending-status'
      case 'overdue': return 'sch-fm-overdue-status'
      default: return 'sch-fm-paid-status'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Paid'
      case 'pending': return 'Partial'
      case 'overdue': return 'Overdue'
      default: return 'Paid'
    }
  }

  return (
    <div className="sch-fm-fee-management-container">
      {isPageLoading ? (
        <PageLoader 
          title="Loading Fee Details" 
          subtitle="Fetching your payment information..." 
          icon="💰" 
        />
      ) : (
        <>
      {/* Header */}
      <div className="sch-fm-fee-management-header">
        <div className="sch-fm-header-left">
          <h1 className="sch-fm-page-title">Fee Management</h1>
          <p className="sch-fm-page-subtitle">Track and manage all your fee payments</p>
        </div>
      </div>

      {/* ROW 1: Important Fee Alerts - Full Width */}
      <div className="sch-fm-fee-alerts-card">
        <div className="sch-fm-alert-header">
          <span className="sch-fm-alert-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 20h20L12 2z" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 9v4m0 4h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <h3 className="sch-fm-alert-title">Important Fee Alerts</h3>
        </div>
        <div className="sch-fm-alert-content">
          <div className="sch-fm-alert-item">
            <span className="sch-fm-alert-item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#f59e0b" strokeWidth="2"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke="#f59e0b" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="sch-fm-alert-text">
              <strong>Hostel Fee Due:</strong> ₹10,000 due on <strong>10 Nov 2025</strong>
            </span>
          </div>
          <div className="sch-fm-alert-item">
            <span className="sch-fm-alert-item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="sch-fm-alert-text">
              <strong>Reminder:</strong> Complete payment before due date to avoid late fees
            </span>
          </div>
          <div className="sch-fm-alert-item">
            <span className="sch-fm-alert-item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9H4.5A2.5 2.5 0 0 1 2 6.5V6a1 1 0 0 1 1-1h3M18 9h1.5A2.5 2.5 0 0 0 22 6.5V6a1 1 0 0 0-1-1h-3" stroke="#0bf536ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 5v7a6 6 0 0 0 12 0V5H6zM12 18v3M8 21h8" stroke="#0bf536ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="sch-fm-alert-text">
              <strong>Scholarship Applied:</strong> ₹5,000 academic excellence scholarship credited
            </span>
          </div>
        </div>
      </div>

      {/* ROW 2: Four Summary Cards */}
      <div className="sch-fm-summary-cards-row">
        <div className="sch-fm-summary-card sch-fm-blue-card">
          <div className="sch-fm-summary-icon sch-fm-blue-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 3h12M6 8h12M6 13l10 8M16 13H6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="sch-fm-summary-details">
            <p className="sch-fm-summary-label-upper">Total Amount</p>

            <h2 className="sch-fm-summary-amount">₹1,23,000</h2>
            <p className="sch-fm-summary-label">Annual Fee Structure</p>
          </div>
        </div>

        <div className="sch-fm-summary-card sch-fm-green-card">
          <div className="sch-fm-summary-icon sch-fm-green-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="sch-fm-summary-details">
            <p className="sch-fm-summary-label-upper">Total Paid</p>

            <h2 className="sch-fm-summary-amount">₹1,13,000</h2>
            <p className="sch-fm-summary-label">92% Completed</p>
          </div>
        </div>

        <div className="sch-fm-summary-card sch-fm-red-card">
          <div className="sch-fm-summary-icon sch-fm-red-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
              <path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="sch-fm-summary-details">
            <p className="sch-fm-summary-label-upper">Balance</p>

            <h2 className="sch-fm-summary-amount">₹10,000</h2>
            <p className="sch-fm-summary-label">Payment Pending</p>
          </div>
        </div>

        <div className="sch-fm-summary-card sch-fm-purple-card">
          <div className="sch-fm-summary-icon sch-fm-purple-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9H4.5A2.5 2.5 0 0 1 2 6.5V6a1 1 0 0 1 1-1h3M18 9h1.5A2.5 2.5 0 0 0 22 6.5V6a1 1 0 0 0-1-1h-3" stroke="#976df7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 5v7a6 6 0 0 0 12 0V5H6zM12 18v3M8 21h8" stroke="#976df7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="sch-fm-summary-details">
            <p className="sch-fm-summary-label-upper">Scholarship</p>

            <h2 className="sch-fm-summary-amount">₹5,000</h2>
            <p className="sch-fm-summary-label">Academic Excellence</p>
          </div>
        </div>
      </div>

      {/* ROW 3: Three Fee Category Cards */}
      <div className="sch-fm-fee-category-cards-parent" data-testid="school-container-fee-category-cards-parent">
        <div className="sch-fm-fee-category-cards-row">
          {/* Tuition Fee */}
          <div className="sch-fm-fee-category-card">
            <div className="sch-fm-category-header">
              <div className="sch-fm-category-title-section">
                <span className="sch-fm-category-icon sch-fm-green-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6.5C10.5 4.5 8.5 4 6.5 4C4.5 4 2.5 4.5 2 6.5V19C2.5 17 4.5 16.5 6.5 16.5C8.5 16.5 10.5 17 12 19M12 6.5C13.5 4.5 15.5 4 17.5 4C19.5 4 21.5 4.5 22 6.5V19C21.5 17 19.5 16.5 17.5 16.5C15.5 16.5 13.5 17 12 19M12 6.5V19" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <h3 className="sch-fm-category-title">Tuition Fee</h3>
                  <p className="sch-fm-category-subtitle">Full Year</p>
                </div>
              </div>
              <span className="sch-fm-status-badge sch-fm-paid-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-status-tick">
                  <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="none"/>
                  <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Paid
              </span>
            </div>
            <div className="sch-fm-category-body">
              <div className="sch-fm-fee-info-row">
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Total Amount</p>
                  <p className="sch-fm-fee-info-value">₹60,000</p>
                </div>
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Total Paid</p>
                  <p className="sch-fm-fee-info-value sch-fm-green-text">₹60,000</p>
                </div>
              </div>
              <div className="sch-fm-fee-info-row">
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Balance</p>
                  <p className="sch-fm-fee-info-value sch-fm-green-text">₹0</p>
                </div>
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Next Due</p>
                  <p className="sch-fm-fee-info-value">—</p>
                </div>
              </div>
              <div className="sch-fm-payment-progress-section">
                <p className="sch-fm-progress-label">Payment Progress (Terms)</p>
                <p className="sch-fm-progress-percentage">100%</p>
              </div>
              <div className="sch-fm-terms-chips">
                <div className="sch-fm-term-chip sch-fm-paid-chip">
                  <span className="sch-fm-term-label">T1</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-paid-chip">
                  <span className="sch-fm-term-label">T2</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-paid-chip">
                  <span className="sch-fm-term-label">T3</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-paid-chip">
                  <span className="sch-fm-term-label">T4</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="sch-fm-terms-info-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="sch-fm-terms-info">4 of 4 terms paid</p>
              </div>
              <button className="sch-fm-pay-button sch-fm-disabled-button" disabled>
                <svg width="16" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Paid
              </button>
            </div>
          </div>

          {/* Hostel Fee */}
          <div className="sch-fm-fee-category-card">
            <div className="sch-fm-category-header">
              <div className="sch-fm-category-title-section">
                <span className="sch-fm-category-icon sch-fm-orange-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12h6v10" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <h3 className="sch-fm-category-title">Hostel Fee</h3>
                  <p className="sch-fm-category-subtitle">Semester 2</p>
                </div>
              </div>
              {/* eslint-disable-next-line no-constant-condition */}
              <span className={`sch-fm-status-badge ${false ? 'sch-fm-paid-badge' : 'sch-fm-pending-badge'}`}>
                {/* eslint-disable-next-line no-constant-condition */}
                {false ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-status-tick">
                      <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="none"/>
                      <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Paid
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="rgb(153, 27, 27)" strokeWidth="2" fill="none"/>
                      <path d="M12 8v4m0 4h.01" stroke="rgb(153, 27, 27)" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    Pending
                  </>
                )}
              </span>
            </div>
            <div className="sch-fm-category-body">
              <div className="sch-fm-fee-info-row">
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Total Amount</p>
                  <p className="sch-fm-fee-info-value">₹45,000</p>
                </div>
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Total Paid</p>
                  <p className="sch-fm-fee-info-value sch-fm-green-text">₹35,000</p>
                </div>
              </div>
              <div className="sch-fm-fee-info-row">
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Balance</p>
                  <p className="sch-fm-fee-info-value sch-fm-red-text">₹10,000</p>
                </div>
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Next Due</p>
                  <p className="sch-fm-fee-info-value">
                    ₹10,000<br />
                    <span className="sch-fm-due-date">10 Nov 2025</span>
                  </p>
                </div>
              </div>
              <div className="sch-fm-payment-progress-section">
                <p className="sch-fm-progress-label">Payment Progress (Terms)</p>
                <p className="sch-fm-progress-percentage sch-fm-orange-text">78%</p>
              </div>
              <div className="sch-fm-terms-chips">
                <div className="sch-fm-term-chip sch-fm-paid-chip sch-fm-orange-paid">
                  <span className="sch-fm-term-label">T1</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-paid-chip sch-fm-orange-paid">
                  <span className="sch-fm-term-label">T2</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-paid-chip sch-fm-orange-paid">
                  <span className="sch-fm-term-label">T3</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-pending-chip" style={{ background: `linear-gradient(to right, rgb(255, 145, 77) 12%, #f3f4f6 12%)` }}>
                  <span className="sch-fm-term-label" style={{ color: '#1f2937' }}>T4</span>
                  <div style={{ height: '16px' }}></div>
                </div>
              </div>
              <div className="sch-fm-terms-info-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="sch-fm-terms-info">3 of 4 terms paid</p>
              </div>
              <button className="sch-fm-pay-button sch-fm-active-button" onClick={() => {
                setSelectedFeeType('Hostel Fee')
                setSelectedAmount(10000)
                setIsPaymentModalOpen(true)
              }} data-testid="school-button-pay-hostel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Pay Now - ₹10,000
              </button>
            </div>
          </div>

          {/* Transportation Fee */}
          <div className="sch-fm-fee-category-card">
            <div className="sch-fm-category-header">
              <div className="sch-fm-category-title-section">
                <span className="sch-fm-category-icon sch-fm-purple-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="12" rx="2" stroke="#7c3aed" strokeWidth="2"/>
                    <path d="M3 10h18M11 10v5M13 10v5" stroke="#7c3aed" strokeWidth="1.5"/>
                    <rect x="5" y="7" width="4" height="2" rx="0.5" fill="#7c3aed"/>
                    <rect x="15" y="7" width="4" height="2" rx="0.5" fill="#7c3aed"/>
                    <circle cx="7" cy="19" r="1.5" stroke="#7c3aed" strokeWidth="1.5" fill="none"/>
                    <circle cx="17" cy="19" r="1.5" stroke="#7c3aed" strokeWidth="1.5" fill="none"/>
                    <path d="M8.5 18v-0.5M15.5 18v-0.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <div>
                  <h3 className="sch-fm-category-title">Transportation Fee</h3>
                  <p className="sch-fm-category-subtitle">October</p>
                </div>
              </div>
              {/* eslint-disable-next-line no-constant-condition */}
              <span className={`sch-fm-status-badge ${true ? 'sch-fm-paid-badge' : 'sch-fm-pending-badge'}`}>
                {/* eslint-disable-next-line no-constant-condition */}
                {true ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-status-tick">
                      <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="none"/>
                      <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Paid
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
                      <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="none"/>
                      <path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    Pending
                  </>
                )}
              </span>
            </div>
            <div className="sch-fm-category-body">
              <div className="sch-fm-fee-info-row">
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Total Amount</p>
                  <p className="sch-fm-fee-info-value">₹18,000</p>
                </div>
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Total Paid</p>
                  <p className="sch-fm-fee-info-value sch-fm-green-text">₹18,000</p>
                </div>
              </div>
              <div className="sch-fm-fee-info-row">
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Balance</p>
                  <p className="sch-fm-fee-info-value sch-fm-green-text">₹0</p>
                </div>
                <div className="sch-fm-fee-info-item">
                  <p className="sch-fm-fee-info-label">Next Due</p>
                  <p className="sch-fm-fee-info-value">—</p>
                </div>
              </div>
              <div className="sch-fm-payment-progress-section">
                <p className="sch-fm-progress-label">Payment Progress (Terms)</p>
                <p className="sch-fm-progress-percentage sch-fm-purple-text">100%</p>
              </div>
              <div className="sch-fm-terms-chips">
                <div className="sch-fm-term-chip sch-fm-paid-chip sch-fm-purple-paid">
                  <span className="sch-fm-term-label">T1</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-paid-chip sch-fm-purple-paid">
                  <span className="sch-fm-term-label">T2</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-paid-chip sch-fm-purple-paid">
                  <span className="sch-fm-term-label">T3</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-fm-term-chip sch-fm-paid-chip sch-fm-purple-paid">
                  <span className="sch-fm-term-label">T4</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sch-fm-term-tick">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="sch-fm-terms-info-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="sch-fm-terms-info">4 of 4 terms paid</p>
              </div>
              <button className="sch-fm-pay-button sch-fm-disabled-button sch-fm-purple-disabled" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Paid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4: Detailed Fee Breakdown */}
      <div className="sch-fm-fee-breakdown-card">
        <div className="sch-fm-breakdown-header">
          <div className="sch-fm-breakdown-title-section">
            <span className="sch-fm-breakdown-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="rgb(96, 165, 250)" strokeWidth="2"/>
                <path d="M12 7v10M9 10h3.5a1.5 1.5 0 110 3H9h4a1.5 1.5 0 010 3H9" stroke="rgb(96, 165, 250)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <h3 className="sch-fm-breakdown-title">Detailed Fee Breakdown</h3>
          </div>
          <CustomDropdown
            id="fee-category-select"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              'All Categories',
              'Tuition Fees',
              'Hostel Fees',
              'Mess Fees',
              'Transport Fees',
              'Others'
            ]}
            testId="school-dropdown-fee-category"
          />
        </div>
        <div className="sch-fm-breakdown-content">
          {filteredFeeBreakdown.length === 0 ? (
            <div className="sch-fm-breakdown-empty">
              <p className="sch-fm-empty-message">No records found for the selected category.</p>
            </div>
          ) : (
            filteredFeeBreakdown.map((fee) => (
              <div key={fee.id} className="sch-fm-breakdown-item">
                <div className="sch-fm-breakdown-item-left">
                  <h4 className="sch-fm-breakdown-fee-type">{fee.feeType}</h4>
                  <p className="sch-fm-breakdown-description">{fee.description}</p>
                  <div className="sch-fm-breakdown-amounts">
                    <div className="sch-fm-amount-detail">
                      <span className="sch-fm-amount-label">Amount</span>
                      <span className="sch-fm-amount-value">₹{fee.amount.toLocaleString()}</span>
                    </div>
                    <div className="sch-fm-amount-detail">
                      <span className="sch-fm-amount-label">Paid</span>
                      <span className={`sch-fm-amount-value ${fee.paid > 0 ? 'sch-fm-green-text' : ''}`}>
                        ₹{fee.paid.toLocaleString()}
                      </span>
                    </div>
                    <div className="sch-fm-amount-detail">
                      <span className="sch-fm-amount-label">Due Date</span>
                      <span className="sch-fm-amount-value">{fee.dueDate}</span>
                    </div>
                    <div className="sch-fm-amount-detail">
                      <span className="sch-fm-amount-label">Paid Date</span>
                      <span className={`sch-fm-amount-value ${fee.paidDate !== '—' ? 'sch-fm-green-text' : ''}`}>
                        {fee.paidDate}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`sch-fm-breakdown-status ${getStatusClass(fee.status)}`}>
                  {getStatusText(fee.status)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ROW 5 & 6: Structure Tables and Quick Actions - Wrapped in outer container */}
      <div className="sch-fm-structure-and-actions-parent">
        {/* ROW 5: Two Structure Tables */}
        <div className="sch-fm-structure-tables-row">
          {/* Academic Year Fee Structure */}
          <div className="sch-fm-structure-table-card sch-fm-academic-year-table">
          <div className="sch-fm-structure-header sch-fm-academic-header">
            <span className="sch-fm-structure-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor"/>
                <rect x="14" y="13" width="3" height="3" rx="0.5" fill="currentColor"/>
              </svg>
            </span>
            <h3 className="sch-fm-structure-title">Academic Year Fee Structure</h3>
          </div>
          <div className="sch-fm-structure-table">
            <table>
              <thead>
                <tr>
                  <th>Term Type</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Pay Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Term 1</strong>
                    <p className="sch-fm-term-duration">01 Apr 2025 - 30 Jun 2025</p>
                  </td>
                  <td>15 Apr 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-paid-status">Paid</span></td>
                  <td>15 Apr 2025</td>
                </tr>
                <tr>
                  <td>
                    <strong>Term 2</strong>
                    <p className="sch-fm-term-duration">01 Jul 2025 - 30 Sep 2025</p>
                  </td>
                  <td>15 Jul 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-paid-status">Paid</span></td>
                  <td>15 Jul 2025</td>
                </tr>
                <tr>
                  <td>
                    <strong>Term 3</strong>
                    <p className="sch-fm-term-duration">01 Oct 2025 - 31 Dec 2025</p>
                  </td>
                  <td>15 Oct 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-paid-status">Paid</span></td>
                  <td>15 Oct 2025</td>
                </tr>
                <tr>
                  <td>
                    <strong>Term 4</strong>
                    <p className="sch-fm-term-duration">01 Jan 2026 - 31 Mar 2026</p>
                  </td>
                  <td className="sch-fm-red-text">15 Jan 2026</td>
                  <td><span className="sch-fm-table-status sch-fm-pending-status">Pending</span></td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bus Fees Structure */}
        <div className="sch-fm-structure-table-card sch-fm-bus-fees-table">
          <div className="sch-fm-structure-header sch-fm-bus-header">
            <span className="sch-fm-structure-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <rect x="4" y="8" width="16" height="7" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8" cy="18" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="18" r="1.5" fill="currentColor"/>
                <line x1="6" y1="5" x2="6" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18" y1="5" x2="18" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <h3 className="sch-fm-structure-title">Bus Fees Structure</h3>
          </div>
          <div className="sch-fm-structure-table">
            <table>
              <thead>
                <tr>
                  <th>Term Type</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Pay Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Quarter 1</strong>
                    <p className="sch-fm-term-duration">01 Apr 2025 - 30 Jun 2025</p>
                  </td>
                  <td>05 Apr 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-paid-status sch-fm-orange-paid">Paid</span></td>
                  <td>05 Apr 2025</td>
                </tr>
                <tr>
                  <td>
                    <strong>Quarter 2</strong>
                    <p className="sch-fm-term-duration">01 Jul 2025 - 30 Sep 2025</p>
                  </td>
                  <td>05 Jul 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-paid-status sch-fm-orange-paid">Paid</span></td>
                  <td>05 Jul 2025</td>
                </tr>
                <tr>
                  <td>
                    <strong>Quarter 3</strong>
                    <p className="sch-fm-term-duration">01 Oct 2025 - 31 Dec 2025</p>
                  </td>
                  <td>05 Oct 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-paid-status sch-fm-orange-paid">Paid</span></td>
                  <td>05 Oct 2025</td>
                </tr>
                <tr>
                  <td>
                    <strong>Quarter 4</strong>
                    <p className="sch-fm-term-duration">01 Jan 2026 - 31 Mar 2026</p>
                  </td>
                  <td className="sch-fm-red-text">05 Jan 2026</td>
                  <td><span className="sch-fm-table-status sch-fm-pending-status sch-fm-orange-pending">Pending</span></td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ROW 6: Mess Fees & Quick Actions */}
      <div className="sch-fm-bottom-row">
        {/* Mess Fees Structure */}
        <div className="sch-fm-structure-table-card sch-fm-mess-fees-table">
          <div className="sch-fm-structure-header sch-fm-mess-header">
            <span className="sch-fm-structure-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#7e3ced" strokeWidth="2"/>
                <path d="M8 10v-1c0-.5.5-1 1-1s1 .5 1 1v1M8 10v8M10 10v8" stroke="#7e3ced" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 8v10M14 10h4M14 13h4M14 16h4" stroke="#7e3ced" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <h3 className="sch-fm-structure-title">Mess Fees Structure</h3>
          </div>
          <div className="sch-fm-structure-table">
            <table>
              <thead>
                <tr>
                  <th>Term Type</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Pay Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>October 2025</strong>
                    <p className="sch-fm-term-duration">01 Oct 2025 - 31 Oct 2025</p>
                  </td>
                  <td>01 Oct 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-paid-status sch-fm-purple-paid">Paid</span></td>
                  <td>01 Oct 2025</td>
                </tr>
                <tr>
                  <td>
                    <strong>November 2025</strong>
                    <p className="sch-fm-term-duration">01 Nov 2025 - 30 Nov 2025</p>
                  </td>
                  <td>01 Nov 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-paid-status sch-fm-purple-paid">Paid</span></td>
                  <td>01 Nov 2025</td>
                </tr>
                <tr>
                  <td>
                    <strong>December 2025</strong>
                    <p className="sch-fm-term-duration">01 Dec 2025 - 31 Dec 2025</p>
                  </td>
                  <td className="sch-fm-red-text">01 Dec 2025</td>
                  <td><span className="sch-fm-table-status sch-fm-pending-status sch-fm-purple-pending">Pending</span></td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>
                    <strong>January 2026</strong>
                    <p className="sch-fm-term-duration">01 Jan 2026 - 31 Jan 2026</p>
                  </td>
                  <td className="sch-fm-red-text">01 Jan 2026</td>
                  <td><span className="sch-fm-table-status sch-fm-pending-status sch-fm-purple-pending">Pending</span></td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="sch-fm-quick-actions-card">
          <div className="sch-fm-quick-actions-header">
            <span className="sch-fm-quick-actions-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="skyblue" strokeWidth="2"/>
                <line x1="2" y1="10" x2="22" y2="10" stroke="skyblue" strokeWidth="2"/>
                <line x1="6" y1="15" x2="10" y2="15" stroke="skyblue" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <h3 className="sch-fm-quick-actions-title">Quick Actions</h3>
          </div>
          <div className="sch-fm-quick-actions-buttons">
            <button className="sch-fm-action-button sch-fm-make-payment-button" onClick={() => {
              setSelectedFeeType('Hostel Fee')
              setSelectedAmount(10000)
              setIsPaymentModalOpen(true)
            }} data-testid="school-button-make-payment">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="6" y1="15" x2="10" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Make Payment
            </button>
            <button className="sch-fm-action-button sch-fm-download-receipt-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download Receipt
            </button>
            <button className="sch-fm-action-button sch-fm-payment-history-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Payment History
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        feeType={selectedFeeType}
        amount={selectedAmount}
      />
        </>
      )}
    </div>
  )
}

export default FeeManagement