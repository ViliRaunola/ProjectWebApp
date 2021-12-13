import { Button } from "@mui/material"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; //Source: https://mui.com/components/material-icons/
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

//Component that handles the display of vote buttons and the functionality of them. 
//Takes 2 props. One is the post that is beign voted on. Other is the user that votes
const VotingPost = ({post, user}) => {

    const [upVotes, setUpVotes] = useState(0)
    const [downVotes, setDownVotes] = useState(0)

    var jwt = sessionStorage.getItem('token');

    //Reads the lenght of the list that contains the user id's that have voted on the post
    useEffect(() => {
        setUpVotes(post.upVotes.length)
        setDownVotes(post.downVotes.length)
    }, [])

    //Sends upvote command to server
    const sendUpVote = () => {
        fetch(`/api/vote/post`,{
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({postId: post._id, upVote: true,downVote: false, userId: user.id}),
            mode: 'cors'
        }).then(res => res.json())
            .then(data => {
                if(data.success){ //Waiting for the server to response. 
                    window.location.reload(false);
                }
        })
    }

    //Sends down vote command to server
    const sendDownVote = () => {
        fetch(`/api/vote/post`,{
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({postId: post._id, downVote: true, upVote: false, userId: user.id}),
            mode: 'cors'
        }).then(res => res.json()) //TODO: Maybe check the error when non logged in user tries to vote?
            .then(data => {
                if(data.success){ //Waiting for the server to response. 
                    window.location.reload(false);
                }
        })
    }


    //Source for checking wether the fetches are complete: https://www.youtube.com/watch?v=k2Zk5cbiZhg&t=552s&ab_channel=TraversyMedia
    return (
       <Box sx={{mt: 'auto'}} display='flex' flexDirection="column">
            <Button onClick={sendUpVote} disabled={false} sx={{color: 'green'}} size='small' startIcon={<ArrowUpwardIcon/>}>{upVotes}</Button>
            <Button onClick={sendDownVote} disabled={false} sx={{color: 'red'}} startIcon={<ArrowDownwardIcon/>}>{downVotes}</Button>
       </Box>
    )
}

export default VotingPost
