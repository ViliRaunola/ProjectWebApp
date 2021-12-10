import { Button } from "@mui/material"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; //Source: https://mui.com/components/material-icons/
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box } from "@mui/material";

const Voting = ({comment}) => {
    var upVotes = 0;
    var downVotes = 0;
    var disableVote = true;

    var jwt = sessionStorage.getItem('token');

    //Make the buttons function if the user is loggedin
    if(jwt){
        disableVote = false;
    }

    //Making sure that the object that is passed is not empty.
    //Source: https://www.codegrepper.com/code-examples/javascript/react+check+if+object+is+empty
    if(Object.keys(comment).length !== 0){
        upVotes = comment.upVotes.length
        downVotes = comment.downVotes.length
    }

    return (
       <Box sx={{mt: 'auto'}} display='flex' flexDirection="column">
            <Button disabled={disableVote} sx={{color: 'green'}} size='small' startIcon={<ArrowUpwardIcon/>}>{upVotes}</Button>
            <Button disabled={disableVote} sx={{color: 'red'}} startIcon={<ArrowDownwardIcon/>}>{downVotes}</Button>
       </Box>
    )
}

export default Voting
