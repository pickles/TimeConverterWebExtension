import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import TZRow from "./TZRow";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const TZTable = ({
    targetTimezones,
    dateToConvert,
    targetLocale,
    defaultTimezone,
    format,
    handleDeleteRow=null
}) => {
    const [now, setNow] = useState(DateTime.now());
    
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(DateTime.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const generateRows = () => {
        return targetTimezones.map((tz) => {
            return <TZRow 
                key={tz} 
                targetTimezone={tz} 
                now={now} 
                dateToConvert={dateToConvert} 
                locale={targetLocale}
                defaultTimezone={defaultTimezone}
                format={format}
                onDelete={handleDeleteRow} />;
        });
    };

    const shouldShowDelete = (handleDeleteRow != null);


    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Current</TableCell>
                        <TableCell>Converted</TableCell>
                        { shouldShowDelete &&
                        <TableCell>Del</TableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {generateRows()}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TZTable;