import { format, tzDate } from "@formkit/tempo";
const parser = require('any-date-parser');
import { DateTime, Settings } from 'luxon';

function TZRow(props: {
    timezone: string, 
    now: DateTime, 
    dateToConvert: string,
    locale: string,
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

            const parsed = parser.fromString(toConvert, props.locale) as Date;
            console.log("Parsed", parsed);
            console.log("Type:", typeof parsed);
            if ("invalid" in parsed) {
                throw new Error("Could not paese the string as a date.");
            }
            converted = DateTime.fromJSDate(parsed).setZone(props.timezone).toFormat("yyyy-MM-dd HH:mm:ss") + " " + offsetName;
        } catch (e) {
            console.error(e);
        }
    }

    const handleDelete = () => {
        props.onDelete(props.timezone);
    };

    // TODO: Add copy functionality
    return (
        <tr>
            <td>
                {props.timezone}
            </td>
            <td>
                {current}
            </td>
            <td>
                {converted}
            </td>
            <td>
                {props.timezone != "UTC" && <button onClick={handleDelete}>Delete</button>}
            </td>
        </tr>
    );
}

export default TZRow;
