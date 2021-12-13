import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'; //Source: https://mui.com/components/material-icons/

//Delete button component with a styling. Takes 2 porps, first is the object that is assosiated with the button and the other is function handle that will be ran when the button is pressed
const DelButton = ({ contentObj, onDelete}) => {
    return (
        <Button startIcon={<DeleteIcon/>} key={contentObj._id} onClick={() => onDelete(contentObj)} sx={{ px: 5.5, mt: 1, maxWidth: '60px'}}  size='small' color='warning' variant="contained">Delete</Button>
    )
}

export default DelButton
