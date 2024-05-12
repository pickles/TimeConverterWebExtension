import { useState } from "react";
import { format } from "@formkit/tempo";
import Select from "react-select";

import "./style.css";

function IndexPopup() {
  const [data, setData] = useState("");
  const now = new Date();

  return (
    <div>
      {format({date: now, format: "YYYY-MM-DD HH:mm:ss Z", tz: "UTC"})}
    </div>
  )
}

export default IndexPopup
