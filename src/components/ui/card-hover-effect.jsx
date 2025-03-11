import { cn } from "../../lib/utils"
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
  hoverClassName
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    (<div
      className={cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}>
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className={cn("absolute -z-10 inset-0 h-full w-full bg-primary/[0.5] block rounded-xl", hoverClassName)}
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }} />
            )}
          </AnimatePresence>
          {item}
        </div>
      ))}
    </div>)
  );
};

