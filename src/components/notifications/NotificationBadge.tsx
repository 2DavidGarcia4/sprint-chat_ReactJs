export default function NotificationBadge({notifications}: {notifications: number}){
  return (
    <div className='notificationBadge'>
      <span>{notifications}</span>
    </div>
  )
}