interface DicePlaceholderProps {
  value: number;
  className?: string;
  isMatching?: boolean;
}

export function DicePlaceholder({ value, className = '', isMatching = false }: DicePlaceholderProps) {
  return (
    <div className={`
      dice ${isMatching ? 'matching' : ''}
      w-full h-full 
      bg-gradient-to-br from-red-500 to-red-700
      rounded-lg
      flex items-center justify-center
      text-white font-bold text-3xl
      border-2 border-red-800
      ${className}
    `}>
      {value}
    </div>
  );
}