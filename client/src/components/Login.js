import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react'
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


function Login() {

    let navigate = useNavigate();

    const [user, setUser] = useState({})
    const [err, setErr] = useState('')

    const whenChanging = (event) => {
        setUser({...user, [event.target.id]: event.target.value})
    }

    const submitForm = (event) => {
        event.preventDefault()

        fetch('/api/user/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(user),
            mode: 'cors'
        }).then(res => res.json())
            .then(data =>  {
                if(data.success){
                    sessionStorage.setItem('token', data.token)
                    navigate(`/`, { replace: true }) //SOURCE for redirection within the app: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router?noredirect=1&lq=1
                }else{
                    setErr(data.message)
                }
            
        }) 
    }


    return (
        <div>
            
            <Typography
                variant='h6'
                color='textSecondary'
                component='h2'
                padding={2}
                >
                    Please Login To Use All Of The Features
            </Typography>

            <div id="form-div">
                <form onSubmit={submitForm} onChange={whenChanging}>
                    <Input placeholder="email" type="email" id="email"></Input>
                    <Input placeholder="password" type="password" id="password"></Input>
                    <Input disableUnderline="true" type="submit" id="submit"></Input>
                </form>
            </div>

            {err && (<Typography
                variant='h6'
                color='red'
                component='h3'
                padding={2}
                >
                   {err}
                </Typography>)}
            
        </div>
    )
}

export default Login