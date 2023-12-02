import React, { useEffect, useState } from "react";
import Box from "./box.module";
import Line from "./line.module";

interface BoxTemplateProps {
    textInBoxes: string[];
    numBoxes: number;
    delay: number;
    myPathScrolled: boolean;
    boxType: number;
}

const BoxTemplate: React.FC<BoxTemplateProps> = ({
    numBoxes: initialNumBoxes,
    textInBoxes: initialTextInBoxes,
    delay: initialDelay,
    myPathScrolled: initialMyPathScrolled,
    boxType: initialBoxType,
}: BoxTemplateProps): JSX.Element => {
    const [numBoxes, setNumBoxes] = useState<number>(initialNumBoxes);
    const [textInBoxes, setTextInBoxes] = useState<string[]>(initialTextInBoxes);
    const [delay, setDelay] = useState<number>(initialDelay);
    const [myPathScrolled, setMyPathScrolled] = useState<boolean>(initialMyPathScrolled);
    const [boxType, setBoxType] = useState<number>(initialBoxType);

    useEffect(() => {
        setNumBoxes(initialNumBoxes);
        setTextInBoxes(initialTextInBoxes);
        setDelay(initialDelay);
        setMyPathScrolled(initialMyPathScrolled);
        setBoxType(initialBoxType);
    }, [initialNumBoxes, initialTextInBoxes, initialDelay, initialMyPathScrolled, initialBoxType]);

    return (
        <>
            {numBoxes <= 4 && numBoxes > 0
                ? textInBoxes.map((text: string, index: number) => (
                    <React.Fragment key={index}>
                        {index !== textInBoxes.length - 1 ? (
                            <>
                                <Box delay={delay + index} myPathScrolled={myPathScrolled} text={text} boxType={boxType} />
                                <Line delay={delay + index + 1} myPathScrolled={myPathScrolled} />
                            </>
                        ) : (
                            <Box delay={delay + textInBoxes.length} myPathScrolled={myPathScrolled} text={text} boxType={boxType} />
                        )}
                    </React.Fragment>
                ))
                : <></>}
        </>
    );
};

export default BoxTemplate;