import { Button } from "@mui/material"

const SubmitButton = ({whenClicked, object}) => {
    return (
        <div>
            <Button onClick={() => whenClicked(object)}>Submit Edit</Button>
        </div>
    )
}

export default SubmitButton
