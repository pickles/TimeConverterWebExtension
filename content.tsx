import { ActionIcon, Container, Group, MantineProvider, Text, TextInput, Tooltip } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { useStorage } from "@plasmohq/storage/hook";
import TZTable from "./TZTable";

// import "@mantine/core/styles.css";
import globalCss from "data-text:@mantine/core/styles.css";

export const getStyle = () => {
    const style = document.createElement('style');
    style.textContent = globalCss;
    return style;
};

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
    const [contentState, setContentState] = useState("none");
    const [selectedText, setSelectedText] = useState("");
    const [selectionRect, setSelectionRect] = useState(new DOMRect(0,0,0,0));

    const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);
    const [targetLocale, setTargetLocale] = useStorage("targetLocale", "en");
    const [defaultTimezone, setDefaultTimezone] = useStorage("defaultTimezone", "UTC");
    const [displayFormat, setDisplayFormat] = useStorage("format", "yyyy-MM-dd HH:mm:ss ZZZ");

    const containerElement = useRef(null);

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
            <MantineProvider>
                <Container 
                    ref={containerElement}
                    style={{
                        position: 'absolute',
                        left: left,
                        top: top,
                    }}
                >
                    <Tooltip label="Convert time" withArrow>
                        <ActionIcon onClick={handleIconClick} style={{
                            backgroundColor: "white",
                            borderRadius: '50%',
                            width: '2em',
                            height: '2em',
                            justifyContent: 'center',
                            boxShadow: '0 10px 25px 0 rgba(0, 0, 0, 0.8)',
                            }}>
                            <BsClockHistory size={'1.5em'} color="black"/>
                        </ActionIcon>
                    </Tooltip>
                </Container>
            </MantineProvider>
        );
    } else if (contentState === "dialog"){
        return (
            <MantineProvider>
                <Container
                    ref={containerElement}
                    style={{
                        position: 'absolute',
                        left: left,
                        top: top,
                        border: '1px solid',
                        borderRadius: '5px',
                        minWidth: '50em',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '1em',
                        boxShadow: '0 10px 25px 0 rgba(0, 0, 0, 0.8)',
                    }}
                >
                    <Group>
                        <TextInput label={"Selection"} value={selectedText} contentEditable={false} styles={{input: {width: '25em', color: 'black'}}} readOnly/>
                        <TextInput label={"LC"} value={targetLocale} contentEditable={false} styles={{input: {width: '5em', color: 'black'}}} readOnly/>
                        <TextInput label={"TZ"} value={defaultTimezone} contentEditable={false} styles={{input: {width: '5em', color: 'black'}}} readOnly/>
                    </Group>

                    {/* TODO: Investigate why the cursor jumps to the end of the line each time a character is entered when "Value" is used here. */}
                    <TextInput
                        label="Format"
                        // value={displayFormat}
                        defaultValue={displayFormat}
                        styles={{input: {maxWidth: '25em', marginBottom: '1em'}}}
                        onChange={(e) => setDisplayFormat(e.currentTarget.value)} />

                    <TZTable 
                            targetTimezones={targetTimezones}
                            dateToConvert={selectedText}
                            targetLocale={targetLocale}
                            defaultTimezone={defaultTimezone}
                            format={displayFormat}
                    />
                </Container>
            </MantineProvider>
        );
    
    } else {
        console.log("unknown content state: ", contentState);
        return (<div ref={containerElement}></div>);
    }

};

export default Content;