import { useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { Autocomplete, Button, IconButton, Stack, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import TZTable from "./TZTable";

const DateConverter = () => {
    const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);
    const [targetLocale, setTargetLocale] = useStorage("targetLocale", "en");
    const [defaultTimezone, setDefaultTimezone] = useStorage("defaultTimezone", "UTC");
    const [format, setFormat, {
        setRenderValue,
        setStoreValue,
        remove
    }] = useStorage("format", (v) => v === undefined ? "yyyy-MM-dd HH:mm:ss ZZZ": v);

    const [dateToConvert, setDateToConvert] = useState("");
    const [selectedTimezone, setSelectedTimezone] = useState("");
    
    const options = ["UTC", ...Intl.supportedValuesOf("timeZone")];

    const handleAddTimezone = () => {
        if (selectedTimezone === "") {
          return;
        }
        if (targetTimezones.includes(selectedTimezone)) {
          return;
        }
        setTargetTimezones([...targetTimezones, selectedTimezone]);
        setSelectedTimezone("");
    };
    
    const handleDeleteTimezone = (timezone) => {
        setTargetTimezones(targetTimezones.filter((tz) => tz !== timezone));
    };

    return (
        <Stack sx={{minWidth: '60em', minHeight: '20em', borderRadius: '10px'}} spacing={2}>
            <Stack direction="row" spacing={"0.5em"}>
                <TextField
                    key="dateToConvertField"
                    label="Date to convert"
                    size="small"
                    value={dateToConvert}
                    style={{width: '30em'}}
                    onChange={(e) => setDateToConvert(e.currentTarget.value)} />
                
                <TextField
                    key="LCField"
                    label="LC"
                    size="small"
                    value={targetLocale}
                    style={{width: '7em'}}
                    onChange={(e) => setTargetLocale(e.currentTarget.value)} />

                <Autocomplete
                    disablePortal
                    value={defaultTimezone}
                    onChange={(event, newValue) => { setDefaultTimezone(newValue);}}
                    options={options}
                    sx={{width: '13em'}}
                    renderInput={(params) => <TextField key="TZField" {...params} label="TZ" size="small" fullWidth />}
                />
            </Stack>

            <Stack direction={'row'} spacing={"0.5em"}>
                <Autocomplete
                    disablePortal
                    value={selectedTimezone}
                    onChange={(event, newValue) => { setSelectedTimezone(newValue);}}
                    options={options}
                    sx={{width: '25em'}}
                    renderInput={(params) => <TextField key="TZsField" {...params} label="Pick a timezone to convert" size="small" />}
                />
                <IconButton onClick={handleAddTimezone}>
                    <AddIcon />
                </IconButton>
            </Stack>

            <Stack direction={'row'} spacing={"0.5em"}>
                <TextField
                        key="outFormatField"
                        label="Format"
                        size="small"
                        value={format}
                        style={{width: '25em'}}
                        onChange={(e) => setRenderValue(e.currentTarget.value)} />
                <IconButton onClick={() => setStoreValue(format)}>
                    <SaveIcon />
                </IconButton>
            </Stack>

            <TZTable
                targetTimezones={targetTimezones}
                dateToConvert={dateToConvert}
                targetLocale={targetLocale}
                defaultTimezone={defaultTimezone}
                format={format}
                handleDeleteRow={handleDeleteTimezone} />
        </Stack>
    );
};

export default DateConverter;
