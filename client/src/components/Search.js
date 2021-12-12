import { Box, TextField } from "@mui/material"

const Search = ({onChangeListener}) => {
    return (
        <Box>
            <TextField placeholder="Search by Title" sx={{p: 2}} onChange={onChangeListener}></TextField>
        </Box>
    )
}

export default Search
