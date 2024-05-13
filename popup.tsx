import { DateTime } from "luxon";
import { useStorage } from "@plasmohq/storage/hook";

import { useEffect, useState } from "react";
import Select from "react-select";
import TZRow from "./TZRow";

import "./style.css";

function IndexPopup() {
  const [now, setNow] = useState(DateTime.now());
  const [dateToConvert, setDateToConvert] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);
  const [targetLocale, setTargetLocale] = useStorage("targetLocale", "en");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let options = Intl.supportedValuesOf("timeZone").map((tz) => { return {"value": tz, "label": tz} });

  const handleTimezoneChanged = (selectedOption) => {
    setSelectedTimezone(selectedOption.value);
  };

  const handleDateToConvertChanged = (e) => {
    setDateToConvert(e.target.value);
  };

  const handleTargetLocaleChanged = (e) => {
    setTargetLocale(e.target.value);
  }

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
    <div className="w-[500px]">
      <div>
        <label>
          DateToConvert: 
          <input type="text" value={dateToConvert} onChange={handleDateToConvertChanged} />
        </label>
        <label>
          Locale: 
          <input type="text" value={targetLocale} onChange={handleTargetLocaleChanged} />
        </label>
      </div>
      <Select
        options={options}
        onChange={handleTimezoneChanged}
        isSearchable={true} />
      <button onClick={handleAddRow}>Add</button>
      <br/><br/>
      <table className="w-[100%]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Current</th>
            <th>Converted</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {generateRows()}
        </tbody>
      </table>
    </div>
  );
}

export default IndexPopup
