const parser = require('any-date-parser');
import { DateTime } from 'luxon';
import { MdDone, MdOutlineContentCopy } from 'react-icons/md';
import { ActionIcon, CopyButton, Table, Tooltip } from '@mantine/core';

function TZRow(props: {
    timezone: string, 
    now: DateTime, 
    dateToConvert: string,
    locale: string,
    defaultTimezone: string,
    onDelete: Function
}) {
    const currentDateTime = props.now.setZone(props.timezone) as DateTime;
    // "ZZZZ" pattern requires locale to be set properly, otherwise it returns like "GMT+09:00"
    // so it requires to get offsetLongName and remove all lowercase letters and spaces to make abbreviation like JST
    const offsetName = currentDateTime.toFormat("ZZZZZ", {locale: "en"}).replace(/[a-z ]/g, "");
    const current = currentDateTime.toFormat("yyyy-MM-dd HH:mm:ss") + " " + offsetName;

    let converted = "-";

    if (props.dateToConvert !== "") {
        try {
            let toConvert = props.dateToConvert.replace(/\//g, "-");
            if (toConvert.match(/^@?\d+$/)) {
                // Unix timestamp
                toConvert = toConvert.replace(/@/,"").slice(0, 10);
                toConvert = `@${toConvert}`;
            }
            
            let parsed = parser.fromString(toConvert, props.locale) as Date;

            // any-date-parser attempt returns parsed object, it contains "offset" if the string contains timezone offset
            const obj = parser.attempt(toConvert, props.locale);
            // console.log("attempt",obj);
            if ("invalid" in obj) {
                throw new Error(`Could not paese the string as a date. ${toConvert}`);
            }
            
            if (!("day" in obj)) {
                parsed.setUTCDate(props.now.day);
            }
            if (!("year" in obj)) {
                parsed.setUTCFullYear(props.now.year);
            }
            if (!("month" in obj)) {
                parsed.setUTCMonth(props.now.month - 1);
            }

            if (!("offset" in obj)) {
                // If the string does not contain timezone offset, try to set timezone from default timezone
                // console.log(`No offset in ${toConvert}`);
                const toGetOffset = parser.attempt(`2000-01-01 00:00:00 ${props.defaultTimezone}`, props.locale);
                if (!("invalid" in toGetOffset)) {
                    const offset = toGetOffset.offset as number;
                    if (typeof offset === 'number') {
                        parsed = new Date(Number(parsed) - offset * 60 * 1000);    
                    }
                }
            }


            
            converted = DateTime.fromJSDate(parsed).setZone(props.timezone).toFormat("yyyy-MM-dd HH:mm:ss") + " " + offsetName;
        } catch (e) {
            // console.error(e);
        }
    }

    const handleDelete = () => {
        props.onDelete(props.timezone);
    };

    const copyText = (e: MouseEvent, text: string) => {
        navigator.clipboard.writeText(text)
    };

    const shouldShowDelete = props.timezone != "UTC" && props.onDelete != null;

    return (
        <Table.Tr>
            <Table.Td>
                {props.timezone}
            </Table.Td>
            <Table.Td>
                {current}
                <CopyButton value={current}>
                    {({copied, copy}) => (
                        <Tooltip label={copied ? "Copied!" : "Copy to clipboard"} withArrow>
                            <ActionIcon onClick={copy} styles={{root: {marginLeft: "10px"}}} size={"xs"}>
                                {copied ? <MdDone /> : <MdOutlineContentCopy />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            </Table.Td>
            <Table.Td>
                {converted}
                { converted !== "-" && 
                <CopyButton value={converted}>
                    {({copied, copy}) => (
                        <Tooltip label={copied ? "Copied!" : "Copy to clipboard"} withArrow>
                            <ActionIcon onClick={copy} styles={{root: {marginLeft: "10px"}}} size={"xs"}>
                                {copied ? <MdDone /> : <MdOutlineContentCopy />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
                }
            </Table.Td>
            <Table.Td>
                { shouldShowDelete && <button className="my-button" onClick={handleDelete}>x</button>}
            </Table.Td>
        </Table.Tr>
    );
}

export default TZRow;
