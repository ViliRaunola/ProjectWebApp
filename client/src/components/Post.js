import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import { Container, Link, TextField, Typography, Box } from '@mui/material'

const Post = () => {

    const {postId} = useParams()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([{}])  

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
                    <Box key={comment.userId || 0} display='flex' flexDirection="column" sx={{width: '50%', justifyContent: 'center',border: 1, borderColor: 'grey.500' , mt: 4, p: 2} }>
                        <TextField disabled id='comment' multiline value={comment.content || ''} ></TextField><br/>
                        <Link >By: {comment.creatorUsername}</Link>
                    </Box>
                ))}

                
               
                
            </Container>
            
        </div>
    )
}

export default Post
