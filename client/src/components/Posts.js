import { Card, CardActionArea, CardContent, Container, Typography, Pagination } from '@mui/material'
import { Box } from '@mui/system';
import {useEffect, useState} from 'react'
import { Suspense } from 'react';
import PostCard from './PostCard';
import Search from './Search'

function Posts() {


    //Source for pagination: https://mui.com/components/pagination/   &   https://www.youtube.com/watch?v=IYCa1F-OWmk&ab_channel=TraversyMedia

    const [posts, setPosts] = useState([{}])   //All of the posts that are fetched from the database
    const [page, setPage] = useState(1);    //Keeps track of the current page that we are on
    const postsOnPage = 4;  //Can choose how many posts you want to show per one page
    const totalPages = Math.ceil(posts.length / postsOnPage) //Calculate all of the pages that are required
    const [noPosts, setNoPosts] = useState(true)    //Keeps track wether a server has given any posts
    const [showPager, setShowPager] = useState(false) //Value that determines wether the pager is used or not
    const [searchWord, setSearchWord] = useState('') //Keeps track of the search term

    const handleChange = (event, value) => { //When the page number is changed we get the new page number we are on
        setPage(value);
    };

    //Fetching all of the posts from the server
    useEffect(() => {
        fetch('api/post/all')
        .then(res => res.json())
        .then(data => {
            if(typeof data.posts === 'undefined'){ //If database reutrns empty array
                setNoPosts(true)
            }else{
                setPosts(data.posts) //Saving the posts that were resieved
                setNoPosts(false)
                if(data.posts.length > 10){ //When there are more than 10 posts received from server pager is used
                    setShowPager(true)
                }
            }
        })
    }, [])

    const whenSearchChanging = (event) => {
        setSearchWord(event.target.value)
    }

    //Get the posts that are to be shown at a spesific page
    const indexLastPost = page * postsOnPage
    const indexFirstPost = indexLastPost - postsOnPage
    const postsToShow = posts.slice(indexFirstPost, indexLastPost); //From the original posts list we slice a piece that contains the posts at a specific page

    //function to determine if the pager is used or not
    const showPagerFunction = () =>{
        if(showPager && searchWord === ''){ //Returning the posts using pager if there are more than 10 posts AND there is no active search
            return (<Box>
                        <PostCard posts={postsToShow} searchWord={searchWord}/>
                        <Pagination count={totalPages} page={page} onChange={handleChange} />
                    </Box>)
        }else{
            return( //Only the posts
                <Box >
                    <PostCard posts={posts} searchWord={searchWord}/>
                </Box>
            ) 
        }
    }

    //It is checked if the session has received any posts from the server. If it has, then they can be displayed.
    return (
        <Container  sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
            
            {/* Posts were found */}
            {!noPosts && <Box>
                            <Search onChangeListener={whenSearchChanging}/>
                            {showPagerFunction()}
                        </Box>
            }

            {/* No posts were found */}
            {noPosts && <Box>
                            <Typography>No posts were found</Typography>
                        </Box>}
        </Container>
        
        
        
    )
}

export default function App() {
    return (
      <Suspense fallback='loading'>
        <Posts/>
      </Suspense>
    )
  }


//export default Posts
