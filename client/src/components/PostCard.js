import { Card, CardActionArea, CardContent, Container, Typography } from '@mui/material'

const PostCard = ({posts, searchWord}) => {

    //Fucntion that is ran inside the filter.
    const filterFunction = (post) => {
        if(searchWord === ''){ //If there is no search word we show all of the posts without filtering
            return post
        }else if(post.title.includes(searchWord)){ //Checks if the posts title match the search key that user gave. Source: https://www.tabnine.com/academy/javascript/how-to-use-the-includes-method-in-javascript/
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
            {posts && <Container sx={{display:'flex', justifyContent:'center', flexDirection: 'column', alignItems: 'center'}}>
                {posts.filter(filterFunction).map((post) => ( //How to use cards in MUI: https://mui.com/components/cards/. Source for filter usage: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                    <Card key={post._id || 0} sx={{ maxWidth: 345, m: 2}}>  {/* The 'or' is to get rid of a warning that says each element should have uniqe key */}
                        <CardActionArea href={`/post/${post._id}`}> {/* When the card is pressed user is redirected to the card's own page */}
                            <CardContent>
                                <Typography variant='h5' gutterBottom>{post.title}</Typography>
                                <Typography sx={{wordWrap: 'break-word'}} variant='body2'>{post.content} </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                   
                ))}
                
            </Container>}
            
            
           
        
        </div>
    )
}

export default PostCard
