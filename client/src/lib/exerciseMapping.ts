/**
 * Exercise type to icon and Chinese label mapping
 */

export const exerciseIconMap: Record<string, string> = {
  running: '🏃',
  walking: '🚶',
  cycling: '🚴',
  swimming: '🏊',
  yoga: '🧘',
  weightlifting: '🏋️',
  strength_training: '🏋️',
  hiit: '🔥',
  stretching: '🤸',
  hiking: '🥾',
  pilates: '🧘',
  basketball: '🏀',
  soccer: '⚽',
  tennis: '🎾',
  elliptical: '🚴',
  rowing: '🚣',
  dancing: '💃',
  climbing: '🧗',
};

export const exerciseLabelMap: Record<string, string> = {
  running: '跑步',
  walking: '步行',
  cycling: '單車',
  swimming: '游泳',
  yoga: '瑜伽',
  weightlifting: '重量訓練',
  strength_training: '重量訓練',
  hiit: '高強度間歇',
  stretching: '伸展',
  hiking: '登山',
  pilates: '普拉提',
  basketball: '籃球',
  soccer: '足球',
  tennis: '網球',
  elliptical: '橢圓機',
  rowing: '划船',
  dancing: '舞蹈',
  climbing: '攀岩',
};

/**
 * Get exercise icon by type
 * @param exerciseType Exercise type (e.g., 'running', 'walking')
 * @returns Icon emoji string
 */
export function getExerciseIcon(exerciseType: string): string {
  const normalized = exerciseType?.toLowerCase().trim() || '';
  return exerciseIconMap[normalized] || '🏃'; // Default to running icon
}

/**
 * Get exercise Chinese label by type
 * @param exerciseType Exercise type (e.g., 'running', 'walking')
 * @returns Chinese label or original if not found
 */
export function getExerciseLabel(exerciseType: string): string {
  const normalized = exerciseType?.toLowerCase().trim() || '';
  return exerciseLabelMap[normalized] || exerciseType; // Fallback to original
}

/**
 * Get both icon and label for an exercise
 * @param exerciseType Exercise type
 * @returns Object with icon and label
 */
export function getExerciseDisplay(exerciseType: string): { icon: string; label: string } {
  return {
    icon: getExerciseIcon(exerciseType),
    label: getExerciseLabel(exerciseType),
  };
}
