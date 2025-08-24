// components/AnimatedElement.tsx
import React, { forwardRef, type JSX } from 'react';
import { useScrollAnimation } from './useScrollAnimation';

interface AnimatedElementProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  animationType?:
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'fade'
    | 'scale';
}

export const AnimatedElement = forwardRef<HTMLElement, AnimatedElementProps>(
  (
    {
      children,
      as: Component = 'div',
      className = '',
      delay = 0,
      duration = 600,
      threshold,
      rootMargin,
      triggerOnce,
      animationType = 'fade-up',
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const { ref, isVisible } = useScrollAnimation({
      threshold,
      rootMargin,
      triggerOnce,
    });

    // Combine refs
    const combinedRef = (node: HTMLElement | null) => {
      if (node) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }
    };

    // Animation classes based on type
    const getAnimationClasses = (type: string, visible: boolean) => {
      const baseClasses =
        'transition-all ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100';

      switch (type) {
        case 'fade-up':
          return `${baseClasses} ${
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-[5vh]'
          }`;
        case 'fade-down':
          return `${baseClasses} ${
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-[5vh]'
          }`;
        case 'fade-left':
          return `${baseClasses} ${
            visible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-[5vw]'
          }`;
        case 'fade-right':
          return `${baseClasses} ${
            visible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-[5vw]'
          }`;
        case 'fade':
          return `${baseClasses} ${visible ? 'opacity-100' : 'opacity-0'}`;
        case 'scale':
          return `${baseClasses} ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`;
        default:
          return `${baseClasses} ${
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-[5vh]'
          }`;
      }
    };

    return React.createElement(
      Component,
      {
        ...props,
        ref: combinedRef,
        className: `
          ${getAnimationClasses(animationType, isVisible)}
          ${className}
        `.trim(),
        style: {
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
          ...style,
        },
      },
      children,
    );
  },
);

AnimatedElement.displayName = 'AnimatedElement';
