import React from 'react';
import styles from './line.module.scss';

interface LineProps {
  delay: number;
  myPathScrolled: boolean;
}

const Line: React.FC<LineProps> = (props: LineProps) => {
  const [myPathScrolled, setMyPathScrolled] = React.useState<boolean>(false);

  const onScroll = React.useCallback((): void => {
      setMyPathScrolled(props.myPathScrolled);
  }, [props.myPathScrolled]);

  React.useEffect(() => {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return <div className={`${styles.line} ${myPathScrolled ? styles[`animation-delay-${props.delay}`] : ""}`}></div>;
};

export default Line;