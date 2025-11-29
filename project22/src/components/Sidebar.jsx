import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../App.jsx'
import './Sidebar.css'

export default function Sidebar() {
  const { user, logout } = useContext(AppContext)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon text-2xl">
            🏠
          </div>
        </div>
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-email">{user.email}</div>
          </div>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/submit" 
          className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span>📝</span>
          <span>Submit Property</span>
        </NavLink>
        
        <NavLink 
          to="/recommendations" 
          className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span>💡</span>
          <span>Recommendations</span>
        </NavLink>
        
        <NavLink 
          to="/admin" 
          className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span>👨‍💼</span>
          <span>Admin</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="sidebar-logout-btn"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}