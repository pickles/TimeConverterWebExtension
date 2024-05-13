import { DateTime } from "luxon";
import { useStorage } from "@plasmohq/storage/hook";

import { useEffect, useState } from "react";
import TZRow from "./TZRow";

import { 
  Autocomplete,
  Button,
  Container, 
  Group,
  MantineProvider,
  Table,
  TextInput 
} from "@mantine/core";
import '@mantine/core/styles.css';

// import 
import mainContainerCss from './css/MainContainer.module.css';

function IndexPopup() {
  const [now, setNow] = useState(DateTime.now());
  const [dateToConvert, setDateToConvert] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);
  const [targetLocale, setTargetLocale] = useStorage("targetLocale", "en");
  
  document.body.className = "w-[30rem]";

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let options = Intl.supportedValuesOf("timeZone");

  const handleAddRow = () => {
    if (selectedTimezone === "") {
      return;
    }
    setTargetTimezones([...targetTimezones, selectedTimezone]);
  };

  const handleDeleteRow = (timezone) => {
    setTargetTimezones(targetTimezones.filter((tz) => tz !== timezone));
  };

  const generateRows = () => {
    return targetTimezones.map((tz) => {
      return <TZRow key={tz} timezone={tz} now={now} dateToConvert={dateToConvert} locale={targetLocale} onDelete={handleDeleteRow} />;
    });
  }

  return (
    <MantineProvider defaultColorScheme="auto">
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
        </Group>

        <Group styles={{root: {marginTop: '1em', marginBottom: '1em'}}}>
          <Autocomplete
            placeholder="Pick a timezone to convert"
            styles={{input: {width: '25em'}}}
            data={options}
            onChange={setSelectedTimezone} />
          <Button onClick={handleAddRow}>+</Button>
        </Group>

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
      </Container>
    </MantineProvider>
  );
}

export default IndexPopup
