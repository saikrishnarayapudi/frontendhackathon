
import React from 'react'
import { NavLink } from 'react-router-dom'
import './QuickNav.css'

export default function QuickNav() {
  return (
    <div className="quick-nav">
      <div className="quick-nav-header">
        <span className="quick-nav-title">Quick Navigation</span>
      </div>
      <nav className="quick-nav-links">
        <NavLink 
          to="/" 
          className={({isActive}) => `quick-nav-link ${isActive ? 'active-cyan' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/submit" 
          className={({isActive}) => `quick-nav-link ${isActive ? 'active-yellow' : ''}`}
        >
          Submit
        </NavLink>
        <NavLink 
          to="/recommendations" 
          className={({isActive}) => `quick-nav-link ${isActive ? 'active-purple' : ''}`}
        >
          Recommendations
        </NavLink>
        <NavLink 
          to="/admin" 
          className={({isActive}) => `quick-nav-link ${isActive ? 'active-pink' : ''}`}
        >
          Admin
        </NavLink>
      </nav>
    </div>
  )
}
