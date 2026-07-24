import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';


interface MinimalistHeroProps {
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export const MinimalistHero = ({
  imageSrc,
  imageAlt,
  className,
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden bg-background p-8 min-h-[600px]',
        className
      )}
    >
      {/* Center Image with Circle */}
      <div className="relative flex justify-center items-center h-full">
          <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute z-0 h-[300px] w-[300px] rounded-full bg-yellow-400/90 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
          ></motion.div>
          <motion.img
              src={imageSrc}
              alt={imageAlt}
              className="relative z-10 h-auto w-56 object-cover md:w-64 scale-150 lg:w-72"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80`;
              }}
          />
      </div>
    </div>
  );
};
