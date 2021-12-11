import { useState } from "react"
import { TextField, Typography, Button, Container, Box } from "@mui/material"
import { useNavigate } from "react-router-dom";

const CreatePost = () => {

    let navigate = useNavigate();
    const [post, setContent] = useState({})

    const whenChanging = (event) => {
        setContent({...post, [event.target.id]: event.target.value})
    }

    var jwt = sessionStorage.getItem('token')

    //When send button is pressed the jwt token and post contents are sent to server which will add the post to database
    const submitPost = (event) => {
        event.preventDefault()

        fetch('/api/post/add', {
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify(post),
            mode: 'cors'
        }).then(res => res.json())
            .then(data =>  {
                if(data.success){ //If the post addition was completed we are redirected to the posts page
                    navigate(`/posts`, { replace: true }) //SOURCE for redirection within the app: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router?noredirect=1&lq=1
                }else{
                   console.log('Adding the post failed')
                }
        }) 
    }

    return (
        
        <Container sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}} >
            <Typography
                variant='h6'
                color='textSecondary'
                component='h2'
                padding={2}
                >
                    Here you can submit your own post
            </Typography>

            
        <form onSubmit={submitPost} onChange={whenChanging}>
            <Box display='flex' flexDirection="column" sx={{display:'flex', flexDirection: 'column'}}>
                <TextField multiline placeholder="Title" type="text" id="title"></TextField>
                <TextField multiline placeholder="Your Post" type="text" id="content"></TextField>
                <Button type="submit" id="submit">Send</Button>
            </Box>
        </form>
            
        </Container>
           

        
    )
}

export default CreatePost
