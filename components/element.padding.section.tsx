import React from 'react';
import { PaddingElementProps } from '@/modules/exportInterfaces';

const PaddingElement: React.FC<PaddingElementProps> = (numberProp: PaddingElementProps): JSX.Element => {
    const style: object = {
        height: `${numberProp.height}vh`,
    };

    return (
        <div style={style} className={`divPadding`}></div>
    )
};

export default PaddingElement;