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
  const [docRef] = useState(database.collection('live_sessions').doc(id));

  useEffect(() => {
    let cancelled = false;

    // async function connect() {
    //   const peerConnection = new RTCPeerConnection();

    //   const offer = await peerConnection.createOffer();
    //   await peerConnection.setLocalDescription(offer);

    //   const roomWithOffer = {
    //     offer: {
    //       type: offer.type,
    //       sdp: offer.sdp,
    //     },
    //   };

    //   await docRef.set(roomWithOffer);
    // }

    // connect();

    return () => {
      cancelled = true;
    };
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
