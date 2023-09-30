import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Typography, IconButton/*, Badge*/ } from '@mui/material';

const NoDataComponent = () => {
    return (
        <>
        <IconButton color='warning'>
            <ReportProblemIcon />
            {/*<Badge badgeContent={'0'} color='warning'>*/}
                <Typography>
                &nbsp; Oops! {" No data "}
            </Typography>
            {/*</Badge>*/}
        </IconButton>
        </>
    )
}

export default NoDataComponent;