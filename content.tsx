import { ActionIcon, Container, MantineProvider, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { useStorage } from "@plasmohq/storage/hook";
import { useClickOutside } from "@mantine/hooks";
import TZTable from "./TZTable";

const CONTAINER_ELEMENT_ID = "page-memo-time-converter-root";

export const getRootContainer = () => {
    console.log("getRootContainer");

    const root = document.createElement("div");
    root.id = CONTAINER_ELEMENT_ID;
    document.body.after(root);
    return root;
};

const Content = () => {
    const [contentState, setContentState] = useState("none");
    const [selectedText, setSelectedText] = useState("");
    const [rect, setRect] = useState(null);

    const [targetTimezones, setTargetTimezones] = useStorage("targetTimezones", ["UTC"]);

    useClickOutside(() => {
        setContentState("none")
    }, null, [document.getElementById(CONTAINER_ELEMENT_ID)]);

    const handleMouseUp = (e: MouseEvent) => {
        if (contentState === "icon") {
            setContentState("none");
        } else if (contentState === "dialog") {
            return;
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

    const handleAddRow = (selectedTimezone: string) => {
        if (selectedTimezone === "") {
            return;
        }
        setTargetTimezones([...targetTimezones, selectedTimezone]);
    };

    const handleDeleteRow = (timezone: string) => {
        setTargetTimezones(targetTimezones.filter((tz) => tz !== timezone));
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
            <MantineProvider>
                <Container style={{
                    position: 'absolute',
                    left: left,
                    top: top,
                }}>
                    <Tooltip label="Convert selected date" withArrow>
                        <ActionIcon radius="x1" size="xl" onClick={handleIconClick} color="auto">
                            <BsClockHistory />
                        </ActionIcon>
                    </Tooltip>
                </Container>
            </MantineProvider>
        );
    } else if (contentState === "dialog"){
        return (
            <>
                <MantineProvider defaultColorScheme="auto">
                    <Container style={{
                        position: 'absolute',
                        left: left,
                        top: top,
                        color: 'black',
                        backgroundColor: 'white',
                        border: '1px solid black',
                        borderRadius: '5px',
                        minWidth: '40em'
                        }}
                        size={"sm"}
                    >
                    <TZTable 
                            targetTimezones={targetTimezones}
                            dateToConvert={selectedText}
                            targetLocale={"en"}
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