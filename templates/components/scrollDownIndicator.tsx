import React from "react";

const ScrollDownIndicator: React.FC = (): JSX.Element => {
    return (
        <div className="scrollDownIndicator">
            <div className="mouse">
                <div className="mouse-wheel"></div>
            </div>
            <p>Scroll</p>
        </div>
    );
};

export default ScrollDownIndicator;