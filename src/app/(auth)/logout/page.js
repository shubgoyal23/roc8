'use client'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Logout() {
    const router = useRouter()
useEffect(() => {
    fetch("/api/logout").then(() => {

    }).catch((err) => {console.log(err)}).finally(() => {
        router.replace("/")
    })
})
  return (
    <div className='w-full h-20 mt-10'>
      <Loading></Loading>
    </div>
  )
}

export default Logout
