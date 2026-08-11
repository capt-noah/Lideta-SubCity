import React from 'react'

function ProfileSkeletons() {
 return (
 <div className='grid grid-cols-[400px_1fr] gap-15 py-6 px-15'>
 {/* Profile Card Skeleton */}
 <div className='skeleton h-fit border rounded-xl p-10 flex flex-col items-center relative'>
 <div className='relative mb-4'>
 <div className='skeleton w-60 h-60 rounded-full border-4 border-white shadow-lg'></div>
 <div className='skeleton absolute bottom-0 right-0 w-10 h-10 rounded-full shadow-lg'></div>
 </div>
 <div className='skeleton h-7 w-40 rounded mb-1'></div>
 <div className='skeleton h-4 w-24 rounded'></div>
 </div>

 <div className='space-y-6 w-180 '>

 {/* Personal Information Section Skeleton */}
 <div className='bg-white border-2 border-gray-300 rounded-xl '>
 <div className='skeleton flex h-15 rounded-tr-lg rounded-tl-lg px-8 justify-between items-center'>
 <div className='skeleton h-6 w-48 rounded'></div>
 <div className='skeleton w-9 h-9 rounded-full'></div>
 </div>
 <div className='py-5 px-8 space-y-0'>
 {[1, 2, 3, 4, 5, 6].map((item) => (
 <div key={item} className={`flex justify-between items-center py-4 ${item !== 6 ? 'border-b border-gray-200' : ''}`}>
 <div className='skeleton h-4 w-24 rounded'></div>
 <div className='skeleton h-5 w-48 rounded'></div>
 </div>
 ))}
 </div>
 </div>

 {/* dmin Information Section Skeleton */}
 <div className='bg-white border-2 border-gray-300 rounded-xl '>
 <div className='skeleton flex h-15 rounded-tr-lg rounded-tl-lg px-5 justify-between items-center'>
 <div className='skeleton h-6 w-40 rounded'></div>
 <div className='skeleton w-9 h-9 rounded-full'></div>
 </div>
 <div className='p-5 space-y-0'>
 <div className='flex justify-between items-center py-4 border-b border-gray-200'>
 <div className='skeleton h-4 w-20 rounded'></div>
 <div className='flex items-center gap-2'>
 <div className='skeleton h-5 w-48 rounded'></div>
 <div className='skeleton w-7 h-7 rounded'></div>
 </div>
 </div>
 <div className='flex justify-between items-center py-4 border-b border-gray-200'>
 <div className='skeleton h-4 w-20 rounded'></div>
 <div className='skeleton h-5 w-32 rounded'></div>
 </div>
 <div className='flex justify-between items-center py-4 border-b border-gray-200'>
 <div className='skeleton h-4 w-12 rounded'></div>
 <div className='skeleton h-5 w-64 rounded'></div>
 </div>
 <div className='flex justify-between items-center py-4'>
 <div className='skeleton h-4 w-20 rounded'></div>
 <div className='flex items-center gap-2'>
 <div className='skeleton h-5 w-32 rounded'></div>
 <div className='skeleton w-7 h-7 rounded'></div>
 </div>
 </div>
 </div>
 </div>

 {/* Preferences Section Skeleton */}
 <div className='bg-white border-2 border-gray-300 rounded-xl '>
 <div className='skeleton flex h-15 rounded-tr-lg rounded-tl-lg px-5 justify-between items-center'>
 <div className='skeleton h-6 w-32 rounded'></div>
 <div className='skeleton w-9 h-9 rounded-full'></div>
 </div>
 <div className='p-5 space-y-6'>
 {/* Theme Options Skeleton */}
 <div>
 <div className='skeleton h-4 w-16 rounded mb-3'></div>
 <div className='flex px-10 gap-6'>
 <div className='flex gap-4 border-2 border-gray-200 rounded-2xl p-4'>
 <div className='skeleton w-10 h-10 rounded'></div>
 <div className='w-25 space-y-2'>
 <div className='skeleton h-9 rounded'></div>
 <div className='skeleton h-9 rounded'></div>
 <div className='skeleton h-5 rounded'></div>
 </div>
 </div>
 <div className='skeleton flex gap-2 border-2 border-gray-200 p-4 rounded-2xl'>
 <div className='skeleton w-10 h-10 rounded'></div>
 <div className='w-25 space-y-2'>
 <div className='skeleton h-9 rounded'></div>
 <div className='skeleton h-9 rounded'></div>
 <div className='skeleton h-5 rounded'></div>
 </div>
 </div>
 </div>
 </div>

 {/* Font Size Options Skeleton */}
 <div>
 <div className='skeleton h-4 w-12 rounded mb-3'></div>
 <div className='flex gap-3'>
 {[1, 2, 3].map((item) => (
 <div key={item} className='skeleton h-9 w-20 rounded-full'></div>
 ))}
 </div>
 </div>
 </div>
 </div>
 
 </div>
 </div> 
 )
}

export default ProfileSkeletons















