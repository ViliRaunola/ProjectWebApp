import Button from '@mui/material/Button'

const DelButton = ({ contentObj, onDelete}) => {
    return (
        <div>
            <Button key={contentObj._id} onClick={() => onDelete(contentObj)} sx={{ mt: 1, maxWidth: '25px', ml: '75%'}}  size='small' color='warning' variant="contained">Delete</Button>
        </div>
    )
}

export default DelButton
