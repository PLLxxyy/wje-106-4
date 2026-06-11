import { MOOD_EMOJI, MOOD_LABEL, MOOD_TYPES, type MoodType } from '../../constants/enums';

interface MoodEmojiProps {
  value: MoodType;
  onChange: (mood: MoodType) => void;
  readonly?: boolean;
}

export const MoodEmoji = ({ value, onChange, readonly = false }: MoodEmojiProps) => (
  <div className="flex flex-wrap gap-3">
    {MOOD_TYPES.map((mood) => {
      const selected = value === mood;
      return (
        <button
          key={mood}
          type="button"
          disabled={readonly}
          onClick={() => onChange(mood)}
          className={`min-w-24 rounded-lg border px-3 py-2 text-left transition ${
            selected
              ? 'scale-105 border-tea bg-tea/10 text-tea dark:border-emerald-300 dark:text-emerald-200'
              : 'border-stone-200 bg-white/70 text-stone-600 hover:border-tea dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300'
          }`}
        >
          <span className="mr-2 text-xl">{MOOD_EMOJI[mood]}</span>
          <span className="text-sm">{MOOD_LABEL[mood]}</span>
        </button>
      );
    })}
  </div>
);
