import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import { Container, Link, TextField, Typography, Box, Button } from '@mui/material'
import { useNavigate } from "react-router-dom";

const Post = () => {

    let navigate = useNavigate();

    const {postId} = useParams()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([{}])
    const [newComment, setNewComment] = useState({})

    var jwt = sessionStorage.getItem('token');
    
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
        })
        fetch(`/api/comment/${postId}`)
        .then(res => res.json())
        .then(data => {
            setComments(data.comments)
        })
    }, [])
    

    return (
        <div>
            <Container sx={{display:'flex', justifyContent:'center', flexDirection: 'column', alignItems: 'center'}} >
                <Box display='flex' flexDirection="column" sx={{width: '75%', justifyContent: 'center',border: 1, mt: 4, pb: 2, px: 2} }>
                    <Typography  variant='h6' color='textPrimary' component='h2' padding={2}> {post.title}</Typography>
                    <TextField disabled id='content' multiline value={post.content || ''} ></TextField><br/>
                    <Link >By: {post.creatorUsername}</Link>
                </Box>

                {/* Making sure that server returned comments. If it didn't this won't be run */}
                {comments && comments.map((comment) => (
                    <Box key={comment._id || 0} display='flex' flexDirection="column" sx={{width: '50%', justifyContent: 'center',border: 1, borderColor: 'grey.500' , mt: 4, p: 2} }>
                        <TextField disabled id='comment' multiline value={comment.content || ''} ></TextField><br/>
                        <Link >By: {comment.creatorUsername}</Link>
                    </Box>
                ))}

                {/* Making sure that the user is logged in. Otherwise this add comment form isn't showed */}
                {jwt && <form onSubmit={submitComment} onChange={whenChanging}>
                    <TextField multiline sx={{m: 1}} variant="outlined" placeholder="Add Comment" type="text" id="content"></TextField>
                    <Button sx={{mt: 3}} type="submit" variant="contained" id="submit">Send</Button>
                </form>}
            
               
                
            </Container>
            
        </div>
    )
}

export default Post
