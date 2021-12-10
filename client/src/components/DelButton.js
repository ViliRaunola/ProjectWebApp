import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'; //Source: https://mui.com/components/material-icons/

const DelButton = ({ contentObj, onDelete}) => {
    return (
        <Button startIcon={<DeleteIcon/>} key={contentObj._id} onClick={() => onDelete(contentObj)} sx={{ px: 5.5, mt: 1, maxWidth: '60px', ml: 'auto'}}  size='small' color='warning' variant="contained">Delete</Button>
    )
}

export default DelButton
