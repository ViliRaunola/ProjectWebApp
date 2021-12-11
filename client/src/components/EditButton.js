import { Button } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'; //Source: https://mui.com/components/material-icons/

const EditButton = ({clickEvent}) => {
    return (
        <div>
            <Button startIcon={<EditIcon/>} onClick={() => clickEvent()} sx={{ px: 5.5, mt: 1, maxWidth: '60px'}}  size='small' color='secondary' variant="contained">Edit</Button>
        </div>
    )
}

export default EditButton
