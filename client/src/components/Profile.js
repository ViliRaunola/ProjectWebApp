import { Suspense } from 'react';
import {useEffect, useState} from 'react'
import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import moment from 'moment'

function Profile() {
    const [user, setUser] = useState({})
    //When the page is loaded, user information is fetched from the server.
    useEffect(() => {
      if(sessionStorage.getItem('token')){ //Check if the user is logged in. If not then the request to the server is not made
        var jwt = sessionStorage.getItem('token');
        fetch('/api/user/profile', {
          headers: {'Authorization': `Bearer ${jwt}`}
        }).then(res => res.json())
          .then(data => {
            setUser({})
            setUser(data.user)
          })
      }
    }, [])

    return (
        <div>
          <Box sx={{m: 2}}>
          <Typography
              variant='h6'
              color='textSecondary'
              component='h2'
              padding={2}
              >
                  Profile Page
          </Typography>
            <TextField
              disabled
              id="name"
              label="Name"
              value={user.name || ''} //Had a problem with the loading of values. Solved by: https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro
            /><br/><br/>
            <TextField
              disabled
              id="username"
              label="Username"
              value={user.username || ''} 
            /><br/><br/>
            <TextField
              disabled
              id="email"
              label="Email"
              value={user.email || ''} 
            /><br/><br/>
            <TextField
              disabled
              id="created"
              label="Created"
              value={moment(user.created).utc().format('DD/MM/YY') || ''} //Source for formatting mongoose time stamp in react: https://stackoverflow.com/questions/62342707/how-to-format-date-from-mongodb-using-react
            />
          </Box>
          
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
