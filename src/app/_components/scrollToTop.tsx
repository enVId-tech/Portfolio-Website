"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from '@/styles/scrolltotop.module.scss';

/**
 * ScrollToTop component that displays a button to scroll to the top of the page.
 * The button becomes visible when the user scrolls down a certain distance.
 * @returns {React.ReactElement} The rendered ScrollToTop component.
 */
const ScrollToTop = React.memo((): React.ReactElement => {
  // State to manage the button's visibility state
  const [buttonState, setButtonState] = useState<'hidden' | 'visible' | 'fading'>('hidden');

  /**
   * Toggles the visibility of the scroll-to-top button based on the scroll position.
   */
  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 300) {
      if (buttonState === 'hidden' || buttonState === 'fading') {
        setButtonState('visible');
      }
    } else if (buttonState === 'visible') {
      setButtonState('fading');
      setTimeout(() => {
        setButtonState('hidden');
      }, 400);
    }
  }, [buttonState]);

  /**
   * Scrolls the window to the top smoothly.
   */
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Effect to add and clean up the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
      <button
          className={`${styles.scrollButton} ${
              buttonState === 'visible' ? styles.visible :
                  buttonState === 'fading' ? styles.fading : ''
          }`}
          onClick={scrollToTop}
          aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
  );
});

export default ScrollToTop;