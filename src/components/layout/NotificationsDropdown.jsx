import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell, UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  subscribeToNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../lib/firestoreNotifications.js'

function timeAgo(timestamp) {
  if (!timestamp?.toDate) return ''
  const seconds = Math.floor((Date.now() - timestamp.toDate().getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

function NotificationsDropdown() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToNotifications(user.uid, setNotifications)
    return unsubscribe
  }, [user])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const handleOpenNotification = async (notification) => {
    if (!notification.read) {
      await markNotificationRead(notification.id)
    }
    navigate(`/dashboard/profile/${notification.actorId}`)
  }

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
    await markAllNotificationsRead(unreadIds)
  }

  if (!user) return null

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-primary"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={20}
          align="end"
          className="w-80 rounded-xl border border-white/10 bg-surface/95 p-2 shadow-glow backdrop-blur-glass"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="font-heading text-sm font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="font-body text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-2 py-6 text-center font-body text-sm text-white/40">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <DropdownMenu.Item key={notification.id} asChild>
                  <button
                    onClick={() => handleOpenNotification(notification)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left outline-none transition-colors hover:bg-white/5 ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    {notification.actorPhotoURL ? (
                      <img
                        src={notification.actorPhotoURL}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-semibold text-primary">
                        {initials(notification.actorName)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-xs text-white">
                        <span className="font-medium">{notification.actorName}</span>{' '}
                        {notification.type === 'follow' && 'started following you'}
                      </p>
                      <p className="font-body text-[10px] text-white/40">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {notification.type === 'follow' && (
                      <UserPlus size={13} className="shrink-0 text-primary" />
                    )}
                    {!notification.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                </DropdownMenu.Item>
              ))
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default NotificationsDropdown
