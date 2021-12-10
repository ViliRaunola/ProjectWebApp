import { Button } from "@mui/material"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; //Source: https://mui.com/components/material-icons/
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const Voting = ({comment, user}) => {

    const [upVotes, setUpVotes] = useState(0)
    const [downVotes, setDownVotes] = useState(0)

    var jwt = sessionStorage.getItem('token');

    useEffect(() => {
        setUpVotes(comment.upVotes.length)
        setDownVotes(comment.downVotes.length)
    }, [])

    const sendUpVote = () => {
        fetch(`/api/vote`,{
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({commentId: comment._id, upVote: true,downVote: false, userId: user.id}),
            mode: 'cors'
        }).then(res => res.json())
            .then(data => {
                if(data.success){ //Waiting for the server to response. 
                    window.location.reload(false);
                }
        })
    }

    const sendDownVote = () => {
        fetch(`/api/vote`,{
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({commentId: comment._id, downVote: true, upVote: false, userId: user.id}),
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

export default Voting
