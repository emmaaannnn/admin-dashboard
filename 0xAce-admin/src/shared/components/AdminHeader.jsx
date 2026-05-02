import { useState } from "react";
import { useAdminSession } from "../../app/providers/AdminSessionProvider";
import { useAdminShell } from "../../app/providers/AdminShellProvider";
import "./styles/AdminHeader.css";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 4.5a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm0 0 8.5 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9.5 18h5m-8-2h11.5c-.9-.9-1.5-2.2-1.5-3.5V10a4.5 4.5 0 0 0-9 0v2.5c0 1.3-.6 2.6-1.5 3.5Zm4 2a1.5 1.5 0 0 0 3 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7Zm-6 6.5a6 6 0 0 1 12 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdminHeader() {
  const { adminUser, logout } = useAdminSession();
  const {
    notifications,
    searchPlaceholder,
    searchQuery,
    setSearchQuery,
    unreadNotificationCount,
  } = useAdminShell();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen((current) => !current);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((current) => !current);
    setIsNotificationsOpen(false);
  };

  return (
    <header className="admin-header">
      <div className="admin-header__brand" aria-label="0xACE admin home">
        <img src="/0xACElogo.png" alt="0xAce" className="admin-header__brand-logo" />
      </div>

      <label className="search-shell admin-header__search" aria-label="Search workspace">
        <span className="search-shell__icon">
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>

      <div className="admin-header__actions">
        <div className="header-menu-group">
          <button
            type="button"
            className={`icon-button${isNotificationsOpen ? " is-open" : ""}`}
            onClick={toggleNotifications}
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
          >
            <BellIcon />
            {unreadNotificationCount ? (
              <span className="icon-button__badge">{unreadNotificationCount}</span>
            ) : null}
          </button>

          {isNotificationsOpen ? (
            <div className="dropdown-panel dropdown-panel--notifications">
              <div className="dropdown-panel__header">
                <strong>Notifications</strong>
                <span>{unreadNotificationCount} active</span>
              </div>

              <div className="notification-list">
                {notifications.map((notification) => (
                  <article key={notification.id} className="notification-card">
                    <span
                      className={`notification-card__marker notification-card__marker--${notification.tone}`}
                    />
                    <div>
                      <strong>{notification.title}</strong>
                      <p>{notification.detail}</p>
                    </div>
                    <span>{notification.timeLabel}</span>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="header-menu-group">
          <button
            type="button"
            className={`icon-button${isProfileOpen ? " is-open" : ""}`}
            onClick={toggleProfile}
            aria-label="Open profile menu"
            aria-expanded={isProfileOpen}
          >
            <ProfileIcon />
          </button>

          {isProfileOpen ? (
            <div className="dropdown-panel dropdown-panel--profile">
              <div className="profile-summary">
                <strong>{adminUser?.fullName}</strong>
                <span>{adminUser?.email}</span>
                <span>Role: {adminUser?.role}</span>
              </div>

              <button type="button" className="secondary-button profile-logout" onClick={logout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;