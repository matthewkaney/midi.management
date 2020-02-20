import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';

export function AutoScrollPane({ children }: { children: React.ReactNode }) {
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    ({ target }) => {
      setAuto(target.scrollHeight - target.scrollTop === target.clientHeight);
    },
    [setAuto]
  );

  useLayoutEffect(() => {
    if (auto && ref.current !== null) {
      ref.current.scrollTop =
        ref.current.scrollHeight - ref.current.clientHeight;
    }
  });

  return (
    <div className="scroll" ref={ref} onScroll={handleScroll}>
      {children}
    </div>
  );
}
