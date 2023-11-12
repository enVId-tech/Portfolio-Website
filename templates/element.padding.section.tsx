import React from 'react';

interface PaddingElementProps {
    height: number;
}

const PaddingElement: React.FC<PaddingElementProps> = (numberProp: PaddingElementProps): JSX.Element => {
    const style: object = {
        height: `${numberProp.height}vh`,
    };

    return (
        <div style={style} className={`divPadding`}></div>
    )
};

export default PaddingElement;