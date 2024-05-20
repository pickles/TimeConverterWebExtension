import { useEffect, useRef, useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import TZTable from "./TZTable";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

import { Autocomplete, Button, Container, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import TimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";

const styleElement = document.createElement("style");

const styleCache = createCache({
    key: "plasmo-emotion-cache",
    prepend: true,
    container: styleElement
});

export const getStyle = () => styleElement;

const isInsideDialog = (containerElement, mouseEvent) => {
    if (containerElement === null || containerElement === undefined) {
        return false;
    }
    const rect = containerElement.getBoundingClientRect();
    if (rect.left <= mouseEvent.clientX && mouseEvent.clientX <= rect.right && rect.top <= mouseEvent.clientY && mouseEvent.clientY <= rect.bottom) {
        return true;
    } else {
        return false;
    }
};

const Content = () => {
    console.log("Content");
    const [contentState, setContentState] = useState("none");
    const [selectedText, setSelectedText] = useState("");
    const [selectionRect, setSelectionRect] = useState(new DOMRect(0,0,0,0));

    const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);
    const [targetLocale, setTargetLocale] = useStorage("targetLocale", "en");
    const [defaultTimezone, setDefaultTimezone] = useStorage("defaultTimezone", "UTC");
    const [displayFormat, setDisplayFormat, {
        setRenderValue,
        setStoreValue,
        remove
    }] = useStorage("format");

    const containerElement = useRef(null);

    const options = ["UTC", ...Intl.supportedValuesOf("timeZone")];

    const handleMouseUp = (e: MouseEvent) => {
        if (contentState === "icon") {
            setContentState("none");
        } else if (contentState === "dialog") {
            if (isInsideDialog(containerElement.current, e)) {
                return;
            } else {
                setContentState("none");
                return;
            }
        }

        const selection = window.getSelection();
        if (selection === undefined || selection === null) {
            return;
        }
        const selectedText = selection.toString();
        if (selectedText.length == 0) {
            return;
        }

        setSelectedText(selectedText);
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setSelectionRect(rect);
        setContentState("icon");
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            console.log("remove listener")
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [contentState]);

    const handleIconClick = () => {
        console.log("Content clicked: ", selectedText);
        setContentState("dialog");
    };

    let left: number = window.scrollX;
    let top: number = window.scrollY;
    top += selectionRect.bottom;

    if (selectionRect !== null) {
        // TODO: Get size of dialog and adjust position
        left += (selectionRect.left + selectionRect.right) / 2;
        if (contentState === "dialog" && (left + 640) > window.innerWidth) {
            left -= 640;
            if (left < 0) left = 0;
        }
        // if (dialogRect !== null && (top + dialogRect.height) > window.innerHeight) {
        //     console.log("top: ", top, "dialog height: ", dialogRect.height, "window height: ", window.innerHeight)
        //     top -= dialogRect.height;
        // }
    }

    if (contentState === "none") {
        return (<div ref={containerElement}></div>);
    } else if (contentState === "icon") {
        return (
            <CacheProvider value={styleCache}>
                <Container
                    ref={containerElement}
                    sx={{
                        position: 'absolute',
                        top: top,
                        left: left
                    }}
                >
                    <IconButton
                        sx={{backgroundColor: 'white', boxShadow: '0 10px 25px 0 rgba(0, 0, 0, 0.8)'}}
                        onClick={handleIconClick}
                    >
                        <TimeIcon />
                    </IconButton>
                </Container>
            </CacheProvider>
        )
    } else if (contentState === "dialog") {
        return (
            <CacheProvider value={styleCache}>
                <Stack
                    spacing={"0.5em"}
                    ref={containerElement}
                    sx={{
                        position: 'absolute', 
                        top: top, 
                        left: left,
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        minWidth: '50em',
                        padding: '0.5em',
                        boxShadow: '0 10px 25px 0 rgba(0, 0, 0, 0.8)'
                    }}
                >
                    <Stack direction="row" spacing={"0.5em"}>
                        <TextField
                            label="Date to convert"
                            size="small"
                            value={selectedText}
                            onChange={(e) => setSelectedText(e.currentTarget.value)}
                            fullWidth />

                        <TextField
                            label="LC"
                            size="small"
                            value={targetLocale}
                            style={{width: '7em'}}
                            onChange={(e) => setTargetLocale(e.currentTarget.value)} />

                        <Autocomplete
                            disablePortal
                            value={defaultTimezone}
                            onChange={(event, newValue) => { setDefaultTimezone(newValue) }}
                            options={options}
                            sx={{width: '13em'}}
                            renderInput={(params) => <TextField {...params} label="TZ" size="small"  />} />
                    </Stack>

                    <Stack direction="row" spacing={"0.5em"}>
                        <TextField
                            key="displayFormatField"
                            label="Format"
                            size="small"
                            value={displayFormat}
                            style={{width: '30em'}}
                            onChange={(e) => setRenderValue(e.currentTarget.value)} />

                        <IconButton onClick={() => setStoreValue()}>
                            <SaveIcon />
                        </IconButton>
                    </Stack>

                    <TZTable 
                        targetTimezones={targetTimezones}
                        dateToConvert={selectedText}
                        targetLocale={targetLocale}
                        defaultTimezone={defaultTimezone}
                        format={displayFormat}
                        />
                </Stack>
            </CacheProvider>
        );
    } else {
        return (<div ref={containerElement}></div>);
    }
};

export default Content;