import { ActionIcon, Container, MantineProvider, Tooltip } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { useStorage } from "@plasmohq/storage/hook";
import TZTable from "./TZTable";
import '@mantine/core/styles.css';

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
    const [rect, setRect] = useState(null);

    const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);
    const [defaultTimezone, setDefaultTimezone] = useStorage("defaultTimezone", "UTC");

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
        setRect(rect);
        setContentState("icon");
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [contentState]);

    const handleIconClick = () => {
        console.log("Content clicked: ", selectedText);
        setContentState("dialog");
    };

    let left: number = window.scrollX;
    let top: number = window.scrollY;

    if (rect !== null) {
        left += (rect.left + rect.right) / 2;
        top += rect.bottom;
    }

    if (contentState === "none") {
        return (<></>);
    } else if (contentState === "icon") {
        return (
            <>
                <MantineProvider>
                    <Container 
                        ref={containerElement}
                        style={{
                        position: 'absolute',
                        left: left,
                        top: top,
                        border: '1px solid',
                        borderRadius: '5px',
                        color: 'black',
                        opacity: '1',
                    }}>
                        <Tooltip label="Convert selected date" withArrow>
                            <ActionIcon radius="x1" size="xl" onClick={handleIconClick} color="auto">
                                <BsClockHistory />
                            </ActionIcon>
                        </Tooltip>
                    </Container>
                </MantineProvider>
            </>
        );
    } else if (contentState === "dialog"){
        return (
            <>
                <MantineProvider>
                    <Container
                        ref={containerElement}
                        style={{
                            position: 'absolute',
                            left: left,
                            top: top,
                            border: '1px solid',
                            borderRadius: '5px',
                            minWidth: '40em',
                        }}
                        size={"sm"}
                    >
                    <TZTable 
                            targetTimezones={targetTimezones}
                            dateToConvert={selectedText}
                            targetLocale={"en"}
                            defaultTimezone={defaultTimezone}
                    />
                    </Container>
                </MantineProvider>
            </>
        );
    
    } else {
        console.log("unknown content state: ", contentState);
        return (<></>);
    }

};

export default Content;