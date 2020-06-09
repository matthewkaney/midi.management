const sessions = new Map<string, LiveSession>();

import firebase from 'firebase/app';
import { database } from './firebase';

export function getSession(id: string) {
  if (!sessions.has(id)) {
    sessions.set(id, new LiveSession(id));
  }

  return sessions.get(id) as LiveSession;
}

class LiveSession {
  private cleanupTasks: (() => void)[];

  private userDoc: Promise<firebase.firestore.DocumentReference>;

  constructor(id: string) {
    this.cleanupTasks = [];

    const sessionDoc = database.collection('live_sessions').doc(id);
    this.userDoc = sessionDoc.collection('users').add({ name: 'Anonymous' });

    this.userDoc.then((userDoc) => {
      sessionDoc.collection('users').onSnapshot((snapshot) => {
        console.log(snapshot);
      });
    });
  }

  set name(name: string) {
    console.log(name);
  }

  close() {
    for (let task of this.cleanupTasks) {
      task();
    }
  }
}
