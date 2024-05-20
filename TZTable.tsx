import { Table } from "@mantine/core";
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

    return (
        <>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Current</Table.Th>
                        <Table.Th>Converted</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {generateRows()}
                </Table.Tbody>
            </Table>
        </>
    );
}

export default TZTable;