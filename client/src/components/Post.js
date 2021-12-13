import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import { Container, Link, TextField, Typography, Box, Button } from '@mui/material'
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import DelButton from './DelButton';
import Voting from './Voting';
import VotingPost from './VotingPost';
import EditButton from './EditButton'
import SubmitButton from './SubmitButton'
import moment from 'moment'

const Post = () => {

    let navigate = useNavigate();

    const {postId} = useParams()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([{}])
    const [newComment, setNewComment] = useState({})
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [editPost, setEditPost] = useState(true)
    const [editComment, setEditComment] = useState(true)
    const [commentIdBeignEdited, setCommentIdBeignEdited] = useState('') //Keeps track of the comment that is beign edited. Other wise all comments could be edited at the same time
    const [updatedComment, setUpdatedComment] = useState({})

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

    const postOnChange = (event) => {
        setPost({...post, [event.target.id]: event.target.value})
    }

    //Source for updating a object inside an array: https://www.robinwieruch.de/react-update-item-in-list/
    const commentOnChange = (event, id) => { //Get the event and the id of the comment that is beign changed
        const newComments = comments.map((comment) => { //Create a new comments list from the old comments list
            if(comment._id === id){ //If a comment is found that matches the comment that is beign edited it is changed
                const updatedComment = {    //Creating a new comment that has the same values as the old one but change the content to that from the user's edit
                    ...comment, content: event.target.value
                }
                setUpdatedComment(updatedComment) //Saving the updated comment so it can be then sent to server
                return updatedComment; //Returning the updated comment back
            }
            return comment //Returning this modified comment back to the list that is beign created from the old ones
        })
        setComments(newComments) //Now the modified comments list is set as the current comments and the modifies can be seen/ done in the front end
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

    //Ran when clicked edit button.
    //Toggles edits to post
    const allowEditPost = () => {
        if(editPost){
            setEditPost(false)
        }else{
            setEditPost(true)
        }
        
    }

    //Ran when clicked edit button.
    //Toggles edit to comment
    const allowEditComment = (comment) => {
        setCommentIdBeignEdited(comment._id)
        if(editComment){
            setEditComment(false)    //Allow edits
        }else{
            setEditComment(true)    //Disable edits
            setCommentIdBeignEdited('') //Resetting the value so no comments can be changed
        }
        
    }

    //Check that the comment is from the user so the deletion button can be shown
    const renderButtonsComment = (comment) => {
        if(decodedJwt.id === comment.userId || user.admin){
            return(
                <Box  display='flex' flexDirection="row-reverse">
                    <DelButton contentObj={comment} onDelete={removeComment} />
                    <EditButton clickEvent={allowEditComment} object={comment}/>
                </Box>
            )
        }
    }

    //Logick to check if the user has logged in. If they are not then these buttons are not showed to them
    const renderButtonsPost = (post) => {
        if(decodedJwt.id === post.creator || user.admin){
            return(
                <Box  display='flex' flexDirection="row-reverse">
                    <DelButton contentObj={post} onDelete={deletePost}/>
                    <EditButton clickEvent={allowEditPost}/>
                </Box>
                
            )
        }
    }


    //Calls the api to inform that a certain comment is beign removed. 
    //Server removes the comment and its connection in the database.
    //When done the page is refreshed
    const removeComment = (comment) => {
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

    const deletePost = (post) => {
        fetch(`/api/post/delete/${post._id}`,{
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({userId: post.creator, comments: comments}),
            mode: 'cors'
        }).then(res => res.json())
            .then(data => {
                if(data.success){ //Waiting for the server to response. If the deletion went through the page is refreshed so the new comment can be seen.
                    navigate('/posts', { replace: true })
                }
        })
    }

    const renderSubmitButtonPost = (post) => {
        if(!editPost){
            return (<SubmitButton whenClicked={sendUpdatedPost} object={post}/>)
        }
    }

    const renderSubmitButtonComment = (comment) => {
        if(!editComment && comment._id === commentIdBeignEdited){
            return (<SubmitButton whenClicked={sendUpdatedComment} object={comment}/>)
        }
    }


    const sendUpdatedComment = (comment) => {
        fetch('/api/comment/modify', {
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({content: updatedComment.content, commentId: updatedComment._id}),
            mode: 'cors'
          }).then(res => res.json())
            .then(data => {
                if(data.success){ //Waiting for the server to response. If the post edit went through the page is refreshed so the post can be seen.
                    setEditComment(true)
                    setCommentIdBeignEdited('')
                    navigate(`/post/${postId}`, { replace: true })
                }
            })
    }

    const sendUpdatedPost = (post) => {
        fetch('/api/post/modify', {
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({content: post.content, postId: postId}),
            mode: 'cors'
          }).then(res => res.json())
            .then(data => {
                if(data.success){ //Waiting for the server to response. If the post edit went through the page is refreshed so the post can be seen.
                    setEditPost(true)
                    navigate(`/post/${postId}`, { replace: true })
                }
            })
    }


    //Source for checking wether the fetches are complete: https://www.youtube.com/watch?v=k2Zk5cbiZhg&t=552s&ab_channel=TraversyMedia
    return loading ? (<p>Loading</p>) : (
        <div>
            {/* The Post is shown here */}
            <Container sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}} >
                <Box display='flex' flexDirection="column" sx={{width: '75%', justifyContent: 'center',border: 1, mt: 4, pb: 2, px: 2} }>
                    <Typography  variant='h6' color='textPrimary' component='h2' padding={2}> {post.title}</Typography>
                    <Typography sx={{mr: 'auto'}} color='textPrimary' padding={0}>Last edited: {moment(post.updatedAt).utc().local().format('DD/MM/YY HH:mm') || ''} </Typography> {/* //Source for formatting mongoose time stamp in react: https://stackoverflow.com/questions/62342707/how-to-format-date-from-mongodb-using-react</Typography> */}
                    <Box display='flex' flexDirection="row" >
                        <TextField sx={{flexGrow: 1}} required disabled={editPost} id='content' multiline value={post.content || ''} onChange={postOnChange}></TextField>
                        <VotingPost post={post} user={user} />
                    </Box>
                    
                    
                    {renderButtonsPost(post)}
                    {renderSubmitButtonPost(post)}
                    <Link sx={{width: '10%'}} href={`/publicprofile/${post.creator}`}>By: {post.creatorUsername}</Link>
                </Box>

                {/* The comment is shown here */}
                {/* Making sure that server returned comments. If it didn't this won't be run */}
                {comments && comments.map((comment) => (
                    <Box key={comment._id || 0} display='flex' flexDirection="column" sx={{width: '50%',border: 1, borderColor: 'grey.500' , mt: 4, p: 2} }>
                        <Typography sx={{mr: 'auto'}} color='textPrimary' padding={0}>Last edited: {moment(comment.updatedAt).utc().local().format('DD/MM/YY HH:mm') || ''} </Typography> {/* //Source for formatting mongoose time stamp in react: https://stackoverflow.com/questions/62342707/how-to-format-date-from-mongodb-using-react</Typography> */}
                        <Box display='flex' flexDirection="row">
                            <TextField sx={{flexGrow: 1}} disabled={commentIdBeignEdited !== comment._id} id='content' multiline value={comment.content || ''} onChange={(event) => commentOnChange(event, comment._id)}></TextField>
                            <Voting comment={comment} user={user}/>
                        </Box>
                        {renderButtonsComment(comment)}
                        {renderSubmitButtonComment(comment)}
                        <Link sx={{width: '20%'}} href={`/publicprofile/${comment.userId}`}>By: {comment.creatorUsername}</Link>
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
