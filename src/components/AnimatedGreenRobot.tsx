import { motion } from 'framer-motion';

interface AnimatedGreenRobotProps {
  size?: number;
  color?: string;
  animationSpeed?: number;
}

export default function AnimatedGreenRobot({
  size = 1000,
  color = '#00FF00',
  animationSpeed = 2,
}: AnimatedGreenRobotProps) {
  const viewBox = `0 0 ${size} ${size}`;
  const strokeWidth = (size / 1000) * 2.5;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', right: 0, top: 0, objectFit: 'contain' }}
      initial={{ opacity: 0.7 }}
      animate={{
        opacity: [0.7, 1, 0.7],
        filter: [
          'drop-shadow(0 0 5px rgba(0, 255, 0, 0.5))',
          'drop-shadow(0 0 15px rgba(0, 255, 0, 0.8))',
          'drop-shadow(0 0 5px rgba(0, 255, 0, 0.5))',
        ],
      }}
      transition={{
        duration: animationSpeed,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.g
        animate={{
          y: [-2, 2, -2],
        }}
        transition={{
          duration: animationSpeed * 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.g id="head">
          <rect
            x={size * 0.35}
            y={size * 0.15}
            width={size * 0.3}
            height={size * 0.15}
            rx={size * 0.02}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />

          <line
            x1={size * 0.35}
            y1={size * 0.2}
            x2={size * 0.65}
            y2={size * 0.2}
            stroke={color}
            strokeWidth={strokeWidth * 0.7}
          />
          <line
            x1={size * 0.35}
            y1={size * 0.25}
            x2={size * 0.65}
            y2={size * 0.25}
            stroke={color}
            strokeWidth={strokeWidth * 0.7}
          />

          <line
            x1={size * 0.4}
            y1={size * 0.15}
            x2={size * 0.4}
            y2={size * 0.3}
            stroke={color}
            strokeWidth={strokeWidth * 0.7}
          />
          <line
            x1={size * 0.45}
            y1={size * 0.15}
            x2={size * 0.45}
            y2={size * 0.3}
            stroke={color}
            strokeWidth={strokeWidth * 0.7}
          />
          <line
            x1={size * 0.55}
            y1={size * 0.15}
            x2={size * 0.55}
            y2={size * 0.3}
            stroke={color}
            strokeWidth={strokeWidth * 0.7}
          />
          <line
            x1={size * 0.6}
            y1={size * 0.15}
            x2={size * 0.6}
            y2={size * 0.3}
            stroke={color}
            strokeWidth={strokeWidth * 0.7}
          />

          <motion.g
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: animationSpeed * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ originX: '50%', originY: '22.5%' }}
          >
            <circle
              cx={size * 0.5}
              cy={size * 0.225}
              r={size * 0.04}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={size * 0.5}
              cy={size * 0.225}
              r={size * 0.025}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={size * 0.5}
              cy={size * 0.225}
              r={size * 0.01}
              fill={color}
            />
            <line
              x1={size * 0.5}
              y1={size * 0.225}
              x2={size * 0.54}
              y2={size * 0.225}
              stroke={color}
              strokeWidth={strokeWidth}
            />
          </motion.g>
        </motion.g>

        <motion.g id="antennas">
          <line
            x1={size * 0.37}
            y1={size * 0.15}
            x2={size * 0.37}
            y2={size * 0.1}
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size * 0.37}
            cy={size * 0.1}
            r={size * 0.01}
            fill={color}
          />

          <line
            x1={size * 0.63}
            y1={size * 0.15}
            x2={size * 0.63}
            y2={size * 0.1}
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size * 0.63}
            cy={size * 0.1}
            r={size * 0.01}
            fill={color}
          />
        </motion.g>

        <motion.g id="body">
          <rect
            x={size * 0.35}
            y={size * 0.3}
            width={size * 0.3}
            height={size * 0.35}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={`body-h-${i}`}
              x1={size * 0.35}
              y1={size * (0.3 + 0.07 * i)}
              x2={size * 0.65}
              y2={size * (0.3 + 0.07 * i)}
              stroke={color}
              strokeWidth={strokeWidth * 0.7}
            />
          ))}

          {[0, 1, 2, 3].map((i) => (
            <line
              key={`body-v-${i}`}
              x1={size * (0.35 + 0.1 * i)}
              y1={size * 0.3}
              x2={size * (0.35 + 0.1 * i)}
              y2={size * 0.65}
              stroke={color}
              strokeWidth={strokeWidth * 0.7}
            />
          ))}
        </motion.g>

        <motion.g
          id="legs"
          animate={{
            y: [-1, 1, -1],
          }}
          transition={{
            duration: animationSpeed * 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        >
          <motion.g id="left-leg">
            <ellipse
              cx={size * 0.4}
              cy={size * 0.68}
              rx={size * 0.03}
              ry={size * 0.04}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <line
              x1={size * 0.37}
              y1={size * 0.68}
              x2={size * 0.43}
              y2={size * 0.68}
              stroke={color}
              strokeWidth={strokeWidth * 0.7}
            />
            <line
              x1={size * 0.4}
              y1={size * 0.72}
              x2={size * 0.4}
              y2={size * 0.78}
              stroke={color}
              strokeWidth={strokeWidth}
            />

            <circle
              cx={size * 0.4}
              cy={size * 0.78}
              r={size * 0.015}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />

            <line
              x1={size * 0.4}
              y1={size * 0.795}
              x2={size * 0.4}
              y2={size * 0.87}
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <ellipse
              cx={size * 0.4}
              cy={size * 0.88}
              rx={size * 0.03}
              ry={size * 0.04}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <line
              x1={size * 0.37}
              y1={size * 0.88}
              x2={size * 0.43}
              y2={size * 0.88}
              stroke={color}
              strokeWidth={strokeWidth * 0.7}
            />

            <ellipse
              cx={size * 0.4}
              cy={size * 0.92}
              rx={size * 0.04}
              ry={size * 0.02}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
          </motion.g>

          <motion.g id="right-leg">
            <ellipse
              cx={size * 0.6}
              cy={size * 0.68}
              rx={size * 0.03}
              ry={size * 0.04}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <line
              x1={size * 0.57}
              y1={size * 0.68}
              x2={size * 0.63}
              y2={size * 0.68}
              stroke={color}
              strokeWidth={strokeWidth * 0.7}
            />
            <line
              x1={size * 0.6}
              y1={size * 0.72}
              x2={size * 0.6}
              y2={size * 0.78}
              stroke={color}
              strokeWidth={strokeWidth}
            />

            <circle
              cx={size * 0.6}
              cy={size * 0.78}
              r={size * 0.015}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />

            <line
              x1={size * 0.6}
              y1={size * 0.795}
              x2={size * 0.6}
              y2={size * 0.87}
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <ellipse
              cx={size * 0.6}
              cy={size * 0.88}
              rx={size * 0.03}
              ry={size * 0.04}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <line
              x1={size * 0.57}
              y1={size * 0.88}
              x2={size * 0.63}
              y2={size * 0.88}
              stroke={color}
              strokeWidth={strokeWidth * 0.7}
            />

            <ellipse
              cx={size * 0.6}
              cy={size * 0.92}
              rx={size * 0.04}
              ry={size * 0.02}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
