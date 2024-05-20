import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import CopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done'

const CopyButton = ({text}) => {
    const [clicked, setClicked] = useState(false);
    const [tooltipTitle, setTooltipTitle] = useState("Copy");

    const copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setClicked(true);
            setTooltipTitle("Copied!");

            setTimeout(() => {
                setClicked(false);
                setTooltipTitle("Copy");
            }, 1500);
        });
    }

    return (
        <Tooltip title={tooltipTitle}>
            <IconButton onClick={(e) => copyText(text)}>
                {clicked ? <DoneIcon /> : <CopyIcon />}
            </IconButton>
        </Tooltip>
    )
};

export default CopyButton;
