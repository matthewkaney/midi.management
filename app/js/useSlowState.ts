import { useState, useRef, useEffect, useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

export function useSlowState<S>(initialState: S) {
  let [state, dispatch] = useState<S>(initialState);

  let ref = useRef<BatchUpdater<S>>(new BatchUpdater<S>(dispatch));

  useEffect(() => {
    return () => {
      ref.current.cancel();
    };
  }, [ref]);

  let slowDispatch = useCallback(
    (update: React.SetStateAction<S>) => {
      ref.current.update(update);
    },
    [ref]
  );

  return [state, slowDispatch] as const;
}

class BatchUpdater<S> {
  updates: React.SetStateAction<S>[] = [];
  dispatch: React.Dispatch<React.SetStateAction<S>>;
  frameId: null | number = null;

  constructor(dispatch: React.Dispatch<React.SetStateAction<S>>) {
    this.dispatch = dispatch;
  }

  update(update: React.SetStateAction<S>) {
    if (this.frameId === null) {
      this.frameId = requestAnimationFrame(() => {
        unstable_batchedUpdates(() => {
          for (let u of this.updates) {
            this.dispatch(u);
          }
        });

        this.frameId = null;
        this.updates = [];
      });
    }

    this.updates.push(update);
  }

  cancel() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.updates = [];
      this.frameId = null;
    }
  }
}
