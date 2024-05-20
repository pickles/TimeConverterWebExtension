const parser = require('any-date-parser');
import { DateTime } from 'luxon';
import { MdDone, MdOutlineContentCopy } from 'react-icons/md';
import { ActionIcon, Button, CopyButton, Table, Tooltip } from '@mantine/core';

function convert(dateStrToConvert: string, targetTimezone: string, locale: string, defaultParseTimezone: string, format="yyyy-MM-dd HH:mm:ss ZZZ"): string {
    try {
        let toConvert = dateStrToConvert.trim();
        toConvert = toConvert.replace(/\//g, "-");

        // Unix timestamp
        if (toConvert.match(/^@?\d{10,}$/)) {
            // TODO: Handle 13-digits Unix timestamp
            toConvert = toConvert.replace(/@/,"").slice(0, 10);
            toConvert = `@${toConvert}`;
        }

        let parsedDate = parser.fromString(toConvert, locale) as Date;

        // any-date-parser#attempt function returns parsed object, it contains "offset" if the string contains timezone offset
        const parts = parser.attempt(toConvert, locale);

        if ("invalid" in parts) {
            throw new Error(`Could not parse the string as a date. ${toConvert}`);
        }

        const now = DateTime.utc();
        // If the string does not contain year, month, day, set it to current date
        if (!("day" in parts)) {
            parsedDate.setUTCDate(now.day);
        }
        if (!("year" in parts)) {
            parsedDate.setUTCFullYear(now.year);
        }
        if (!("month" in parts)) {
            parsedDate.setUTCMonth(now.month - 1);
        }

        // If the string does not contain time, set it to 00:00:00
        if (!("hour" in parts)) {
            parsedDate.setUTCHours(0);
        }
        if (!("minute" in parts)) {
            parsedDate.setUTCMinutes(0);
        }
        if (!("second" in parts)) {
            parsedDate.setUTCSeconds(0);
        }
        if (!("millisecond" in parts)) {
            parsedDate.setUTCMilliseconds(0);
        }

        let result = DateTime.fromJSDate(parsedDate).setZone(targetTimezone);
        if (!("offset" in parts)) {
            // If the string does not contain timezone offset, try to set timezone from default timezone
            const temp = DateTime.fromJSDate(parsedDate, {zone: "UTC"}).setZone(defaultParseTimezone, {keepLocalTime: true});
            result = temp.setZone(targetTimezone);
        }
        
        const offsetName = result.toFormat("ZZZZZ", {locale: "en"}).replace(/[^A-Z]/g, "");
        const format2 = format.replace(/Z3/g, `'${offsetName}'`);
        return result.toFormat(format2, {locale: locale});

    } catch (e) {
        // console.error(e);
    }

    return "-";
}

function TZRow(props: {
    targetTimezone: string, 
    now: DateTime,  // with local time zone
    dateToConvert: string,
    locale: string,
    defaultTimezone: string,
    format: string,
    onDelete: Function
}) {
    const currentDateTimeWithTargetTimezone = props.now.setZone(props.targetTimezone) as DateTime;
    // "ZZZZ" pattern requires locale to be set properly, otherwise it returns like "GMT+09:00"
    // so it requires to get offsetLongName and remove all lowercase letters and spaces to make abbreviation like JST
    const longOffsetName = currentDateTimeWithTargetTimezone.toFormat("ZZZZZ", {locale: "en"});
    console.log(longOffsetName);
    const offsetName = longOffsetName.replace(/[^A-Z]/g, "");
    const current = currentDateTimeWithTargetTimezone.toFormat("yyyy-MM-dd HH:mm:ss") + " " + offsetName;

    let converted = "-";

    if (props.dateToConvert) {
        converted = convert(props.dateToConvert, props.targetTimezone, props.locale, props.defaultTimezone, props.format);
    }

    const handleDelete = () => {
        props.onDelete(props.targetTimezone);
    };

    const copyText = (e: MouseEvent, text: string) => {
        navigator.clipboard.writeText(text)
    };

    const shouldShowDelete = props.targetTimezone != "UTC" && props.onDelete != null;

    return (
        <Table.Tr>
            <Table.Td>
                {props.targetTimezone}
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
                { shouldShowDelete && <button onClick={handleDelete}>x</button>}
            </Table.Td>
        </Table.Tr>
    );
}

export default TZRow;
