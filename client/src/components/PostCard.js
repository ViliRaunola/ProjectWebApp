import { Card, CardActionArea, CardContent, Container, TextField, Typography, Box, CardActions, Button } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; //Source: https://mui.com/components/material-icons/
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const PostCard = ({posts, searchWord}) => {

    //Fucntion that is ran inside the filter. Used to search for posts with a matching word
    const filterFunction = (post) => {
        if(searchWord === ''){ //If there is no search word we show all of the posts without filtering
            return post
        }else if(post.content.includes(searchWord)){ //Checks if the posts content has match with the search key that user gave. Source: https://www.tabnine.com/academy/javascript/how-to-use-the-includes-method-in-javascript/
            return post
        }
    }

    return (
        <div>
             {/* Extra check for an empty array */}
            {!posts && <Typography>
                No posts were found
                </Typography>}

            {/* Use of container: https://mui.com/components/container/ */}
            {posts && <Box >
                {posts.filter(filterFunction).map((post) => ( //How to use cards in MUI: https://mui.com/components/cards/. Source for filter usage: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                    
                    <Card key={post._id || 0} sx={{m: 2}}>  {/* The 'or' is to get rid of a warning that says each element should have uniqe key */}
                    
                        <CardActionArea href={`/post/${post._id}`}> {/* When the card is pressed user is redirected to the card's own page */}
                            <CardContent >
                                <Typography variant='h5' gutterBottom>{post.title}</Typography>
                                <Typography variant="body2" >{post.content}</Typography>
                            </CardContent>
                        </CardActionArea>
                        
                        <CardActions>
                            <Box sx={{mt: 'auto'}} display='flex' flexDirection="row">
                                <Button disabled={true} sx={{color: 'green'}} size='small' startIcon={<ArrowUpwardIcon/>}>{post.upVotes.length}</Button>
                                <Button disabled={true} sx={{color: 'red'}} startIcon={<ArrowDownwardIcon/>}>{post.downVotes.length}</Button>
                             </Box>
                        </CardActions>
                    
                    </Card>
                   
                ))}
                
            </Box>}
            
            
           
        
        </div>
    )
}

export default PostCard
