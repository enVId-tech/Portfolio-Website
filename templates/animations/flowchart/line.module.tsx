import React from 'react';
import styles from './line.module.scss';

interface LineProps {
  delay: number;
}

const Line: React.FC<LineProps> = ({ delay }) => {
  return <div className={`${styles.line} ${styles[`animation-delay-${delay}`]}`}></div>;
};

export default Line;