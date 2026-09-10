import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { selectTheme, toggleTheme } from '../schoolSlice'
import { Button } from '@school-hrms/common-components'

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  
  const handleToggle = () => {
    dispatch(toggleTheme())
  }
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="theme-toggle-btn"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <div className="theme-toggle-icons">
        {/* Sun icon */}
        <SunIcon 
          className={`theme-toggle-icon theme-toggle-sun ${
            theme === 'light' 
              ? 'theme-toggle-icon-active' 
              : 'theme-toggle-icon-inactive'
          }`} 
        />
        
        {/* Moon icon */}
        <MoonIcon 
          className={`theme-toggle-icon theme-toggle-moon ${
            theme === 'dark' 
              ? 'theme-toggle-icon-active' 
              : 'theme-toggle-icon-inactive'
          }`} 
        />
      </div>
    </Button>
  )
}

export default ThemeToggle