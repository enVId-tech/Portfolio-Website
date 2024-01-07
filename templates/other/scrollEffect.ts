import React from 'react';

const animateText = (target: React.MutableRefObject<HTMLElement | null>, text: string, delay: number): void => {
    if (target.current === null) {
        throw new Error("Target not found" as string);
    }

    target.current.innerHTML = "<span class='text'></span><span class='typebar'>|</span>";
    let i: number = 0;
    const intervalId: NodeJS.Timeout = setInterval((): void => {
        if (target.current !== null) {
            const textSpan: HTMLElement | null = target.current.querySelector('.text');

            if (textSpan) {
                textSpan.textContent += text.charAt(i);
            }

            ++i;

            if (i === text.length) {
                clearInterval(intervalId);
                setTimeout((): void => {
                    if (target.current === null) {
                        throw new Error("Target not found" as string);
                    }

                    const typebar: HTMLElement | null = target.current.querySelector('.typebar');
                    
                    if (typebar) {
                        const typebar: HTMLElement = target.current.querySelector('.typebar') as HTMLElement;
                        typebar.style.display = 'none';
                    }
                }, 250);
            }
        }
    }, delay as number);
};

export default animateText;