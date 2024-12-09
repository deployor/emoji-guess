export default function BottomSleigh() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-16 z-10 pointer-events-none">
      <div className="absolute bottom-4 animate-sleigh-reverse">
        <span className="text-4xl">🎅🛷</span>
        <span className="text-2xl">❄️✨❄️</span>
      </div>
    </div>
  );
}