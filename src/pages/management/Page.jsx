/**
 * Generic Management Page Placeholder
 * Used for management module pages that will be implemented later
 */
import React from 'react'

const ManagementPage = ({ title, description }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-600 mt-2">{description || 'This page is coming soon.'}</p>
    </div>
  )
}

export default ManagementPage
