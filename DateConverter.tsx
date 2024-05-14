import { Autocomplete, Button, Container, Group, MantineProvider, TextInput } from "@mantine/core"
import mainContainerCss from './css/MainContainer.module.css';
import { useState } from "react";
import TZTable from "./TZTable";
import { useStorage } from "@plasmohq/storage/hook";

const DateConverter = () => {
    const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);
    const [targetLocale, setTargetLocale] = useStorage("targetLocale", "en");
    const [defaultTimezone, setDefaultTimezone] = useStorage("defaultTimezone", "UTC");

    const [dateToConvert, setDateToConvert] = useState("");
    const [selectedTimezone, setSelectedTimezone] = useState("");
    
    const options = Intl.supportedValuesOf("timeZone");

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
                    
                    <TextInput
                        label="Default TZ"
                        styles={{input: {maxWidth: '5em'}}}
                        value={defaultTimezone}
                        onChange={(e) => setDefaultTimezone(e.currentTarget.value)} />
                    
                </Group>

                <Group styles={{root: {marginTop: '1em', marginBottom: '1em'}}}>
                    <Autocomplete
                        placeholder="Pick a timezone to convert"
                        styles={{input: {width: '25em'}}}
                        data={options}
                        onChange={setSelectedTimezone} />
                    <Button onClick={handleAddTimezone}>+</Button>
                </Group>

                <TZTable
                    targetTimezones={targetTimezones}
                    dateToConvert={dateToConvert}
                    targetLocale={targetLocale}
                    defaultTimezone={defaultTimezone}
                    handleDeleteRow={handleDeleteTimezone} />
            </Container>
        </>
    );
};

export default DateConverter;
