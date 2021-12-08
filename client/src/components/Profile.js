import { Suspense } from 'react';
import {useEffect, useState} from 'react'

function Profile() {
    return (
        <div>
            
        </div>
    )
}

export default function App() {
    return (
      <Suspense fallback='loading'>
        <Profile/>
      </Suspense>
    )
  }


//export default Profile
