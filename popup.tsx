import '@mantine/core/styles.css';

import DateConverter from "./DateConverter";
import { MantineProvider } from "@mantine/core";

function IndexPopup() {
 
  return (
    <MantineProvider defaultColorScheme='auto'>
      <DateConverter />
    </MantineProvider>
  );
}

export default IndexPopup;
