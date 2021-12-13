import { Button } from "@mui/material"

//Submit button component. Takes in 2 props, 1st one is function hadle 2nd one is the object assosiated with the click
const SubmitButton = ({whenClicked, object}) => {
    return (
        <div>
            <Button onClick={() => whenClicked(object)}>Submit Edit</Button>
        </div>
    )
}

export default SubmitButton
