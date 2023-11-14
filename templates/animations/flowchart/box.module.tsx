import React from 'react';
import styles from './box.module.scss';
import { Work_Sans } from 'next/font/google';

const Work_Sans_300 = Work_Sans({
  weight: "300",
  style: 'normal',
  subsets: ['latin']
});

interface BoxProps {
  delay: number;
  myPathScrolled: boolean;
  text: string;
  boxType: number;
}

const Box: React.FC<BoxProps> = (props: BoxProps) => {
  const box = React.useRef<HTMLHeadingElement | null>(null);

  const [myPathScrolled, setMyPathScrolled] = React.useState<boolean>(false);

  const onScroll = React.useCallback((): void => {
    setMyPathScrolled(props.myPathScrolled);
  }, [props.myPathScrolled]);

  const animateText = (target: React.MutableRefObject<HTMLElement | null>, text: string, delay: number): void => {
    if (target.current === null) {
      throw new Error("Target not found" as string);
    }

    target.current.innerHTML = "";
    let i: number = 0;
    const intervalId: NodeJS.Timeout = setInterval((): void => {
      if (target.current !== null) {
        const currentText: string = target.current.innerHTML;
        if (currentText.includes(text) || currentText.length >= text.length + 2) {
          target.current.innerHTML = "";
        }

        target.current.innerHTML += text.charAt(i);
        i++;
        target.current.innerHTML = target.current.innerHTML.replace("|", "");
        target.current.innerHTML += "|";

        if (i === text.length) {
          clearInterval(intervalId);
          setTimeout((): void => {
            target.current!.innerHTML = target.current!.innerHTML.replace("|", "");
          }, 250);
        }
      }
    }, delay);
  };

  React.useEffect((): void => {
    if (props.myPathScrolled) {
      setTimeout((): void => {
        animateText(box, props.text, 100);
      }, 550 + 175 * props.delay);
    }
  }, [props.text, props.myPathScrolled]);


  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div className={`${props.boxType === 2 ? styles.box2 : styles.box} ${myPathScrolled ? styles[`animation-delay-${props.delay}`] : ""}`}>
      <h1 className={`${styles.boxH1} ${Work_Sans_300.className}`} ref={box}></h1>
    </div>
  )
};

export default Box;