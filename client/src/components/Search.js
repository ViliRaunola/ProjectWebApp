import { Box, TextField } from "@mui/material"

//Search field component. Takes in props function that handles the input change tracking
const Search = ({onChangeListener}) => {
    return (
        <Box>
            <TextField placeholder="Search" sx={{p: 2}} onChange={onChangeListener}></TextField>
        </Box>
    )
}

export default Search
