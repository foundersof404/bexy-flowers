import { motion } from 'framer-motion';

/**
 * Skeleton loader for card grids
 * Shows while images are loading
 */
export const CardSkeleton = ({ count = 6, className = '' }: { count?: number; className?: string }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`rounded-3xl overflow-hidden bg-white shadow-md ${className}`}
        >
          {/* Image skeleton */}
          <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: index * 0.1,
              }}
            />
          </div>

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-3/4 overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.1 + 0.2,
                }}
              />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-full overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.1 + 0.3,
                  }}
                />
              </div>
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-5/6 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.1 + 0.4,
                  }}
                />
              </div>
            </div>

            {/* Price and button skeleton */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 bg-gradient-to-r from-amber-200 to-amber-100 rounded w-20 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.1 + 0.5,
                  }}
                />
              </div>
              <div className="h-9 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full w-24 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.1 + 0.6,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;


















