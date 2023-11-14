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

  const [myPathScrolled, setMyPathScrolled] = React.useState<boolean | null>(false);
  const [xPos, setXPos] = React.useState<number | null>(0);
  const [yPos, setYPos] = React.useState<number | null>(0);
  const [dX, setDX] = React.useState<number | null>(0);
  const [dY, setDY] = React.useState<number | null>(0);
  const [mouseRaf, setMouseRaf] = React.useState<number | null>(null);
  const [gradMoveRaf, setGradMoveRaf] = React.useState<number | null>(null);

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
      }, 550 + 175 * props.delay as number);
    }
  }, [props.text, props.myPathScrolled, props.delay]);


  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseRaf) {
        setMouseRaf(requestAnimationFrame(() => {
          const windowWidth: number = window.innerWidth;
          const windowHeight: number = window.innerHeight;

          const mouseXpercentage: number = Math.round(event.pageX / windowWidth * 100);
          const mouseYpercentage: number = Math.round(event.pageY / windowHeight * 100);

          if (xPos && yPos) {
            setDX(mouseXpercentage - xPos);
            setDY(mouseYpercentage - yPos);

            setMouseRaf(null);
          }
        }));
      }

      if (!gradMoveRaf) {
        setGradMoveRaf(requestAnimationFrame(gradMove));
      }
    };

    const gradMove = () => {
      if (xPos && yPos && dX && dY) {
        setXPos(xPos + (dX / 50));
        setYPos(yPos + (dY / 50));

        const absX: number = Math.abs(xPos - dX);
        const absY: number = Math.abs(yPos - dY);
        if (absX < 1 && absY < 1) {
          setGradMoveRaf(null);
          console.log("stop");
        } else {
          setGradMoveRaf(requestAnimationFrame(gradMove));
          console.log("repeat");
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [xPos, yPos, dX, dY, mouseRaf, gradMoveRaf]);

  return (
    <div className={`${props.boxType === 2 ? styles.box2 : styles.box} ${myPathScrolled ? styles[`animation-delay-${props.delay}`] : ""}`} style={{ background: `radial-gradient(at ${xPos}% ${yPos}%, #e6e6e6, #1e1e1e)` }}>
      <h1 className={`${styles.boxH1} ${Work_Sans_300.className}`} ref={box}></h1>
    </div>
  )
};

export default Box;