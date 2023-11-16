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
  const boxH1 = React.useRef<HTMLHeadingElement | null>(null);

  const [myPathScrolled, setMyPathScrolled] = React.useState<boolean | null>(false);

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
        animateText(boxH1, props.text, 100);
      }, 550 + 175 * props.delay as number);
    }
  }, [props.text, props.myPathScrolled, props.delay]);


  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const windowWidth: number = window.innerWidth;
      const windowHeight: number = window.innerHeight;

      const mouseXpercentage: number = Math.round(event.pageX / windowWidth * 100);
      const mouseYpercentage: number = Math.round(event.pageY / windowHeight * 100);

      if (box.current) {
        box.current.style.setProperty('--x', `${mouseXpercentage}%`);
        box.current.style.setProperty('--y', `${mouseYpercentage}%`);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      className={`${props.boxType === 2 ? styles.box2 : styles.box} ${myPathScrolled ? styles[`animation-delay-${props.delay}`] : ""} ${Work_Sans_300.className}`}
      style={{ background: `radial-gradient(at var(--x, 0%) var(--y, 0%), rgba(112, 176, 33, 0.5), rgba(0, 0, 0, 0))` }}
      ref={box}
    >
      <p 
        className={`${styles.boxH1} ${Work_Sans_300.className}`} 
        style={{ color: `rgba(255, 255, 255, ${myPathScrolled ? 1 : 0})` }} 
        ref={boxH1}
      />
    </div>
  )
};

export default Box;