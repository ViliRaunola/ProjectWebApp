import { Container, Typography, Box } from "@mui/material"

const Home = () => {
    return (
        <Container  sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{maxWidth: '75%'}}>
                <Typography variant='h4' color='headerPrimary' component='h1' padding={2}>
                        Welcome to Stack Underflow.
                </Typography>
                <Typography variant='body1' color='primaryText' padding={2} sx={{wordWrap: 'break-word'}}>
                        This is a cheap copy of Stack Owerflow. Here you can post your code snippets and let others comment on them. 
                        You can also vote for the best comment in each post if you found them helpful. But be careful there is mad admin raging. He can delete and edit all the posts. 
                </Typography>
            </Box>
           
        </Container>
    )
}

export default Home
