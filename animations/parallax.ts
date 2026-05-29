import { MotionValue, useTransform } from "framer-motion";

export function useParallaxY(
  progress: MotionValue<number>,
  range: [number, number] = [0, 150]
) {
  return useTransform(progress, [0, 1], range);
}

export function useParallaxScale(
  progress: MotionValue<number>,
  range: [number, number] = [1, 1.15]
) {
  return useTransform(progress, [0, 1], range);
}

export function useHeroScroll(
  progress: MotionValue<number>,
  options?: { scaleEnd?: number; yEnd?: number; opacityEnd?: number }
) {
  const scaleEnd = options?.scaleEnd ?? 0.9;
  const yEnd = options?.yEnd ?? 120;
  const opacityEnd = options?.opacityEnd ?? 0;

  const scale = useTransform(progress, [0, 0.2], [1, scaleEnd]);
  const y = useTransform(progress, [0, 0.2], [0, yEnd]);
  const opacity = useTransform(progress, [0, 0.18], [1, opacityEnd]);
  const blur = useTransform(progress, [0, 0.15], [0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return { scale, y, opacity, filter };
}
