import { Autocomplete, Button, Container, Group, MantineProvider, TextInput } from "@mantine/core"
import mainContainerCss from './css/MainContainer.module.css';
import { useState } from "react";
import TZTable from "./TZTable";
import { useStorage } from "@plasmohq/storage/hook";

const DateConverter = () => {
    const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);
    const [targetLocale, setTargetLocale] = useStorage("targetLocale", "en");
    const [defaultTimezone, setDefaultTimezone] = useStorage("defaultTimezone", "UTC");
    const [outFormat, setOutFormat] = useStorage("format", "yyyy-MM-dd HH:mm:ss ZZZ");

    const [dateToConvert, setDateToConvert] = useState("");
    const [selectedTimezone, setSelectedTimezone] = useState("");
    
    const options = ["UTC", ...Intl.supportedValuesOf("timeZone")];

    const handleAddTimezone = () => {
        if (selectedTimezone === "") {
          return;
        }
        setTargetTimezones([...targetTimezones, selectedTimezone]);
      };
    
      const handleDeleteTimezone = (timezone) => {
        setTargetTimezones(targetTimezones.filter((tz) => tz !== timezone));
      };

    return (
        <>
            <Container classNames={mainContainerCss}>
                <Group>
                    <TextInput 
                        label="DateToConvert" 
                        styles={{input: {width: '25em'}}}
                        value={dateToConvert}
                        onChange={(e) => setDateToConvert(e.currentTarget.value)} />

                    <TextInput
                        label="Locale"
                        styles={{input: {maxWidth: '5em'}}}
                        value={targetLocale}
                        onChange={(e) => setTargetLocale(e.currentTarget.value)} />
                    
                    <Autocomplete
                        label="Default TZ"
                        styles={{input: {maxWidth: '10em'}}}
                        data={options}
                        value={defaultTimezone}
                        onChange={setDefaultTimezone} />
                    
                </Group>

                <Group style={{marginTop: '0.5em', marginBottom: '0.5em'}}>
                    <Autocomplete
                        placeholder="Pick a timezone to convert"
                        styles={{input: {width: '25em'}}}
                        data={options}
                        onChange={setSelectedTimezone} />
                    <Button onClick={handleAddTimezone}>+</Button>
                </Group>

                <TextInput
                    label="Format"
                    value={outFormat}
                    styles={{input: {maxWidth: '25em', marginBottom: '1em'}}}
                    onChange={(e) => setOutFormat(e.currentTarget.value)} />

                <TZTable
                    targetTimezones={targetTimezones}
                    dateToConvert={dateToConvert}
                    targetLocale={targetLocale}
                    defaultTimezone={defaultTimezone}
                    format={outFormat}
                    handleDeleteRow={handleDeleteTimezone} />
            </Container>
        </>
    );
};

export default DateConverter;
