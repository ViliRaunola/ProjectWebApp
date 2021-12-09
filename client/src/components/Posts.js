import { Card, CardActionArea, CardContent, Container, Typography } from '@mui/material'
import {useEffect, useState} from 'react'
import { Suspense } from 'react';

function Posts() {

    const [posts, setPosts] = useState([{}])   

    useEffect(() => {
        fetch('api/post/all')
        .then(res => res.json())
        .then(data => {
            setPosts(data.posts)
        })
    }, [])

    return (
        <div>
            {/* Use of grid: https://mui.com/components/grid/ */}
            <Container sx={{display:'flex', justifyContent:'center', flexDirection: 'column', alignItems: 'center'}}>
                {posts.map((post) => ( //How to use cards in MUI: https://mui.com/components/cards/
                    <Card key={post._id || 0} sx={{ maxWidth: 345, m: 2}}>  {/* The or is to get rid of a warning that says each element should have uniqe key */}
                        <CardActionArea >
                            <CardContent>
                                <Typography variant='body2'>
                                        {post.content}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}

               
            </Container>
           
           
        </div>
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
