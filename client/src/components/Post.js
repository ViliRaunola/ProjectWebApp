import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import { Container, Link, TextField, Typography, Box, Button } from '@mui/material'
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import DelButton from './DelButton';
import Voting from './Voting';

const Post = () => {

    let navigate = useNavigate();

    const {postId} = useParams()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([{}])
    const [newComment, setNewComment] = useState({})
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    var jwt = sessionStorage.getItem('token');
    var decodedJwt = '0'

    //If there was jwt, it is decoded. Would cause an error if there was no token and it was tried to be decoded
    if(jwt){
        decodedJwt = jwt_decode(jwt);  //Source for decoding jwt: https://www.npmjs.com/package/jwt-decode
    }
    
    //Keeps track of the input fields and creates the user object as the fields are beign filled.
    const whenChanging = (event) => {
        setNewComment({...newComment, [event.target.id]: event.target.value})
    }  

    //When user submits a comment it is sent to backend where it is saved to database
    const submitComment = () => {
        fetch(`/api/comment/add`, {
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({content: newComment.content, postId: postId}),
            mode: 'cors'
        }).then(res => res.json())
            .then(data => {
                if(data.success){ //Waiting for the server to response. If the comment addition went through the page is refreshed so the new comment can be seen.
                    navigate(`/post/${postId}`, { replace: true })
                }
            })
    }
    

    //Retreives the post and comments that are assosiated with it.
    useEffect(() => {
        fetch(`/api/post/${postId}`)
        .then(res => res.json())
        .then(data => {
            setPost(data.post)
        }).then(() => fetch(`/api/comment/${postId}`)
        .then(res => res.json())
        .then(data => {
            setComments(data.comments)
        }))
        .then(() => { 
            if(jwt){ //Check if the user is logged in. If not then the request to the server is not made
            fetch('/api/user/profile', {
              headers: {'Authorization': `Bearer ${jwt}`}
            }).then(res => res.json())
              .then(data => {
                setUser({})
                setUser(data.user)
                
              })
          }setLoading(false)})
       
    }, [])

    //Check that the comment is from the user so the deletion button can be shown
    const renderDelButton = (comment) => {
        if(decodedJwt.id === comment.userId){
            return(
                <DelButton contentObj={comment} onDelete={removeComment} />
            )
        }
    }

    //Calls the api to inform that a certain comment is beign removed. 
    //Server removes the comment and its connection in the database.
    //When done the page is refreshed
    const removeComment = (comment) => {
        console.log(comment._id)
        fetch(`/api/comment/delete/${comment._id}`,{
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({userId: comment.userId, postId: postId}),
            mode: 'cors'
        }).then(res => res.json())
            .then(data => {
                
                if(data.success){ //Waiting for the server to response. If the deletion went through the page is refreshed so the new comment can be seen.
                    // navigate(`/post/${postId}`, { replace: true })
                    window.location.reload(false); //*For some reason the navigation doesn't work... Had to use window.location
                }
        })
        
    }



    //Source for checking wether the fetches are complete: https://www.youtube.com/watch?v=k2Zk5cbiZhg&t=552s&ab_channel=TraversyMedia
    return loading ? (<p>Loading</p>) : (
        <div>
            <Container sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}} >
                <Box display='flex' flexDirection="column" sx={{width: '75%', justifyContent: 'center',border: 1, mt: 4, pb: 2, px: 2} }>
                    <Typography  variant='h6' color='textPrimary' component='h2' padding={2}> {post.title}</Typography>
                    <TextField disabled id='content' multiline value={post.content || ''} ></TextField><br/>
                    <Link href={`/publicprofile/${post.creator}`}>By: {post.creatorUsername}</Link>
                </Box>

                {/* Making sure that server returned comments. If it didn't this won't be run */}
                {comments && comments.map((comment) => (
                    <Box key={comment._id || 0} display='flex' flexDirection="column" sx={{width: '50%',border: 1, borderColor: 'grey.500' , mt: 4, p: 2} }>
                        <Box display='flex' flexDirection="row">
                            <TextField sx={{flexGrow: 1}} disabled id='comment' multiline value={comment.content || ''} ></TextField>
                            <Voting comment={comment} user={user}/>
                        </Box>
                        {renderDelButton(comment)}
                        <Link href={`/publicprofile/${comment.userId}`}>By: {comment.creatorUsername}</Link>
                    </Box>
                ))}

                {/* Making sure that the user is logged in. Otherwise this add comment form isn't showed */}
                {jwt && <form onSubmit={submitComment} onChange={whenChanging}>
                    <TextField required multiline sx={{m: 1}} variant="outlined" placeholder="Add Comment" type="text" id="content"></TextField>
                    <Button sx={{mt: 3}} type="submit" variant="contained" id="submit">Send</Button>
                </form>}
            
               
                
            </Container>
            
        </div>
    )
}

export default Post
