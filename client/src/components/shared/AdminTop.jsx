import { useContext } from 'react'
import { adminContext } from '../utils/AdminContext'

function AdminTop() {
  const { admin } = useContext(adminContext)

  return (
    <div className='flex bg-white/60 backdrop-blur-2xl z-10 justify-end items-center px-4 sticky top-0'>
      <div className='w-fit h-16 flex justify-around items-center'>

        {admin ? (
          /* ── Loaded state ── */
          <div className='h-12 bg-[#3A3A3A] rounded-full flex gap-3 items-center px-2 pr-4'>
            {/* Avatar — always a circle */}
            <div className='w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0 flex items-center justify-center bg-emerald-800 text-white font-bold text-sm'>
              {admin.photo ? (
                <img src={admin.photo} className='w-full h-full object-cover' alt='Profile' />
              ) : (
                <span>{admin.first_name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className='flex flex-col justify-center leading-tight'>
              <p className='font-semibold text-sm text-white truncate max-w-[120px]'>
                {admin.first_name} {admin.last_name}
              </p>
              <p className='text-xs text-white/60 truncate max-w-[120px]'>
                {admin.username}
              </p>
            </div>
          </div>
        ) : (
          /* ── Loading skeleton ── */
          <div className='h-12 bg-[#3A3A3A] rounded-full flex gap-3 items-center px-2 pr-4'>
            <div className='skeleton w-9 h-9 rounded-full flex-shrink-0' />
            <div className='flex flex-col gap-1.5 justify-center'>
              <div className='skeleton h-3 w-24 rounded' />
              <div className='skeleton h-2 w-14 rounded' />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminTop
