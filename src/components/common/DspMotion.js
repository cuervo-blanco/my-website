import { MotionConfig, motion, useReducedMotion } from "motion/react";
import "../../assets/styles/dsp-motion.css";

const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

// Shared, restrained motion for DSP pages. Content starts visible in the
// prerendered HTML, and reduced-motion preferences disable the movement.
export function DspMotion({ children }) {
  return (
    <MotionConfig reducedMotion="user" transition={transition}>
      {children}
    </MotionConfig>
  );
}

export function DspReveal({ as = "div", children, ...props }) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      {...props}
      initial={false}
      whileInView={reduceMotion ? undefined : { y: [8, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={transition}
    >
      {children}
    </Component>
  );
}
