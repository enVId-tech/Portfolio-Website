import React from 'react';
import styles from './box.module.scss';

interface BoxProps {
  delay: number;
}

const Box: React.FC<BoxProps> = ({ delay }) => {
  return <div className={`${styles.box} ${styles[`animation-delay-${delay}`]}`}></div>;
};

export default Box;
