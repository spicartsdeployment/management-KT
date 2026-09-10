import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { 
  selectTheme, 
  setTheme, 
  toggleTheme as toggleThemeAction 
} from '../../packages/hrms-school-ui/src/schoolSlice'

export const useTheme = () => {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)

  const setCurrentTheme = (newTheme) => {
    dispatch(setTheme(newTheme))
  }

  const toggleTheme = () => {
    dispatch(toggleThemeAction())
  }

  // Apply theme to document when it changes — instant, no CSS delay
  useEffect(() => {
    const root = document.documentElement;

    // Block transitions so ALL elements repaint instantly
    root.classList.add('no-theme-transition');

    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }

    // Re-enable transitions after the browser has committed the paint
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('no-theme-transition');
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        setCurrentTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setCurrentTheme])

  return {
    theme,
    setTheme: setCurrentTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }
}