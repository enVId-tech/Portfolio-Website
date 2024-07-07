import React from 'react';
import { PaddingElementProps } from '@/templates/ts/exportInterfaces.ts';

const PaddingElement: React.FC<PaddingElementProps> = (numberProp: PaddingElementProps): JSX.Element => {
    const style: object = {
        height: `${numberProp.height}vh`,
    };

    return (
        <div style={style} className={`divPadding`}></div>
    )
};

export default PaddingElement;