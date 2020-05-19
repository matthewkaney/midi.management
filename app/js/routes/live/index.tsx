import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Router, navigate, RouteComponentProps } from '@reach/router';

import { database } from './firebase';

export function MidiLive(props: RouteComponentProps) {
  return (
    <Router>
      <LiveEmpty path="/" />
      <LiveRoom path="/:id" />
    </Router>
  );
}

function LiveEmpty(props: RouteComponentProps) {
  useLayoutEffect(() => {
    let reference = database.collection('live-sessions').doc();
    navigate(`/live/${reference.id}`);
  }, [navigate]);

  return null;
}

type LiveRoomProps = RouteComponentProps & {
  id?: string;
};

function LiveRoom({ id }: LiveRoomProps) {
  const [docRef] = useState(database.collection('live-sessions').doc(id));

  useEffect(() => {
    docRef.set({ hello: 'world' });
  }, [docRef]);

  return <h1>{id}</h1>;
}

//   useEffect(() => {
//     if (!match) {
//       let reference = database.collection('live-sessions').doc();
//       console.log(reference.id);

//       navigate(`./live/${reference.id}`);
//     }

//     // peerConnection = new RTCPeerConnection(configuration);
//   }, [match, navigate]);

//   return (
//     <div className="container">
//       <h1>HEY!</h1>
//     </div>
//   );
// }
