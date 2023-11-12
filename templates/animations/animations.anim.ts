import styled, { css } from 'styled-components';
import React from 'react';

/**
 * Applies animations to elements based on scroll position.
 * @param refs Array of React Refs
 * @param animType Array of animation types
 * @param bufferNum Number to set the buffer, default is 0 (percentage of the window height)
 * @param scssSheet SCSS sheet to apply the animations to
 */
function applyPageAnims(
  scssSheet: any,
  refs: React.RefObject<HTMLDivElement>[],
  animType?: string[],
  bufferNum: number = 0
): void {
  refs.forEach((ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (ref.current !== null) {
      const rect: DOMRect = ref.current.getBoundingClientRect();
      const topPosition: number = rect.top + window.scrollY;
      const bottomPosition: number = rect.bottom + window.scrollY;

      // Buffer is a percentage of the window height
      const buffer: number = bufferNum * window.innerHeight;

      if (animType) {
        if (topPosition < window.scrollY + window.innerHeight - buffer && bottomPosition > window.scrollY + buffer) {
          switch (animType[index]) {
            case "c_left":
              applyAnimation(ref, scssSheet, 'content-anim-left');
              break;
            case "c_right":
              applyAnimation(ref, scssSheet, 'content-anim-right');
              break;
            case "c_up":
              applyAnimation(ref, scssSheet, 'content-anim-up');
              break;
            case "c_down":
              applyAnimation(ref, scssSheet, 'content-anim-down');
              break;
            case "s_left":
              applyAnimation(ref, scssSheet, 'self-anim-left');
              break;
            case "s_right":
              applyAnimation(ref, scssSheet, 'self-anim-right');
              break;
            case "s_up":
              applyAnimation(ref, scssSheet, 'self-anim-up');
              break;
            case "s_down":
              applyAnimation(ref, scssSheet, 'self-anim-down');
              break;
            default:
              applyAnimation(ref, scssSheet, 'visible-class');
              break;
          }
        }
      }
    }
  });
}

/**
 * Applies a styled component animation to the element.
 * @param ref React Ref object
 * @param scssSheet SCSS sheet to apply the animations to
 * @param animationClass Animation class to apply
 */
const applyAnimation = (ref: React.RefObject<HTMLDivElement>, scssSheet: any, animationClass: string) => {
  const StyledComponent = styled(ref.current)`
    ${(props) => css`
      ${scssSheet[animationClass]}
      // Add any additional styles here
    `}
  `;

  return <StyledComponent />;
};

export default applyPageAnims;
