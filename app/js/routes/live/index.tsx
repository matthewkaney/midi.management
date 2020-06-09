import React, { useState, useEffect, useRef } from 'react';
import { navigate, useMatch, RouteComponentProps } from '@reach/router';

import { PolySynth, Frequency } from 'tone';

const synth = new PolySynth().toMaster();

import { onNote } from '@musedlab/midi/messages';
import { receiveMIDI } from '@musedlab/midi/web';

import { Header } from '../../components/header/Header';

// import { getNewId, getSession } from './live';
import { database } from './firebase';

import { newId } from './id';

export function MidiLive(props: RouteComponentProps) {
  const match = useMatch('/live/:id');
  const id = match ? match.id : newId(20);

  // Redirect match
  useEffect(() => {
    if (!match) {
      navigate(`/live/${id}`);
    }
  }, [match, id, navigate]);

  // Create/get unique user id
  const [userId] = useState(newId(12));

  // Delete user document on page close
  useEffect(() => {
    function cleanup() {
      database
        .collection('live')
        .doc(id)
        .collection('users')
        .doc(userId)
        .delete();
    }

    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [id, userId]);

  // User Name
  const [name, setName] = useState('Anonymous');
  const [nameSaved, setNameSaved] = useState(true);

  useEffect(() => {
    if (nameSaved) {
      database
        .collection('live')
        .doc(id)
        .collection('users')
        .doc(userId)
        .set({ name });
    }
  }, [id, userId, name, nameSaved]);

  // List of User Names
  const [users, setUsers] = useState<any>({});

  useEffect(
    () =>
      database
        .collection('live')
        .doc(id)
        .collection('users')
        .onSnapshot((snapshot) => {
          setUsers(
            snapshot.docs.reduce(
              (acc, doc) => ({ [doc.id]: doc.data().name, ...acc }),
              {}
            )
          );
        }),
    [id]
  );

  // Create a call for each existing user
  useEffect(() => {
    let cancelled = false;

    database
      .collection('live')
      .doc(id)
      .collection('users')
      .get()
      .then(({ docs }) => {
        if (!cancelled) {
          for (let doc of docs) {
            let remoteId = doc.id;
            if (remoteId !== userId) {
              database
                .collection('live')
                .doc(id)
                .collection('calls')
                .add({ to: remoteId, from: userId });
            }
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Get current list of all calls
  const [outgoing, setOutgoing] = useState<string[][]>([]);

  useEffect(
    () =>
      database
        .collection('live')
        .doc(id)
        .collection('calls')
        .where('from', '==', userId)
        .onSnapshot((snapshot) => {
          setOutgoing(snapshot.docs.map((doc) => [doc.id, doc.data().to]));
        }),
    [id, userId]
  );

  const [incoming, setIncoming] = useState<string[][]>([]);
  useEffect(
    () =>
      database
        .collection('live')
        .doc(id)
        .collection('calls')
        .where('to', '==', userId)
        .onSnapshot((snapshot) => {
          setIncoming(snapshot.docs.map((doc) => [doc.id, doc.data().from]));
        }),
    [id, userId]
  );

  // Hang up calls when page is closed
  let callsRef = useRef<string[][]>([]);

  useEffect(() => {
    callsRef.current = [...incoming, ...outgoing];
  }, [callsRef, incoming, outgoing]);

  useEffect(() => {
    function cleanup() {
      for (let [callId] of callsRef.current) {
        database
          .collection('live')
          .doc(id)
          .collection('calls')
          .doc(callId)
          .delete();
      }
    }

    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [id, userId, callsRef]);

  return (
    <>
      <Header>
        <input
          type="text"
          value={name}
          onChange={({ target: { value } }) => {
            setName(value);
          }}
          onKeyDown={({ target, key }) => {
            if (key === 'Enter') {
              (target as HTMLElement).blur();
            }
          }}
          onFocus={() => {
            setNameSaved(false);
          }}
          onBlur={() => {
            setNameSaved(true);
          }}
        />
      </Header>
      <main>
        <div>
          {outgoing.map(([call, partner]) => (
            <Connection
              key={call}
              id={id}
              user={userId}
              partner={partner}
              callId={call}
              userNames={users}
            />
          ))}
          {incoming.map(([call, partner]) => (
            <Connection
              key={call}
              id={id}
              user={userId}
              partner={partner}
              callId={call}
              userNames={users}
            />
          ))}
        </div>
      </main>
    </>
  );
}

interface Call {
  id: string;
  from: string;
  to: string;
}

type ConnectionProps = {
  id: string;
  user: string;
  partner: string;
  callId: string;
  userNames: { [id: string]: string };
};

function Connection({ id, user, partner, callId, userNames }: ConnectionProps) {
  const [state, setState] = useState<string>('disconnected');
  const [channel, setChannel] = useState<RTCDataChannel | null>(null);

  useEffect(() => {
    let peer = new RTCPeerConnection();

    peer.onconnectionstatechange = ({ target }) => {
      setState(target.connectionState);
    };

    let callDoc = database
      .collection('live')
      .doc(id)
      .collection('calls')
      .doc(callId);

    callDoc.onSnapshot(async (snap) => {
      let call = snap.data();

      if (!call) return;

      if (call.from === user) {
        // Outgoing call
        if (!call.offer) {
          peer.onicecandidate = ({ candidate }) => {
            if (candidate) {
              callDoc.collection('from_ice').add(candidate.toJSON());
            }
          };

          callDoc.collection('to_ice').onSnapshot(async (snap) => {
            for (let change of snap
              .docChanges()
              .filter(({ type }) => type === 'added')) {
              await peer.addIceCandidate(
                new RTCIceCandidate(change.doc.data())
              );
            }
          });

          let channel = peer.createDataChannel('midi');
          setChannel(channel);
          let offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          await callDoc.update({ offer: { type: offer.type, sdp: offer.sdp } });
        }

        if (call.answer) {
          await peer.setRemoteDescription(call.answer);
        }
      } else {
        peer.ondatachannel = ({ channel }) => {
          setChannel(channel);
        };

        // Incoming call
        if (call.offer && !call.answer) {
          peer.onicecandidate = ({ candidate }) => {
            if (candidate) {
              callDoc.collection('to_ice').add(candidate.toJSON());
            }
          };

          callDoc.collection('from_ice').onSnapshot(async (snap) => {
            for (let change of snap
              .docChanges()
              .filter(({ type }) => type === 'added')) {
              await peer.addIceCandidate(
                new RTCIceCandidate(change.doc.data())
              );
            }
          });

          await peer.setRemoteDescription(call.offer);
          let answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          await callDoc.update({
            answer: { type: answer.type, sdp: answer.sdp },
          });
        }
      }
    });

    return () => {
      //cancelled = true;
    };
  }, [id, user, callId]);

  useEffect(() => {
    if (channel) {
      channel.onmessage = ({ data }) => {
        data = new Uint8Array(data);
        if (data[0] === 144) {
          synth.triggerAttack(Frequency.mtof(data[1]));
        } else {
          synth.triggerRelease(Frequency.mtof(data[1]));
        }
      };
    }
  }, [channel]);

  useEffect(() => {
    if (channel && state === 'connected') {
      return receiveMIDI((message) =>
        channel.send(new Uint8Array(message.data))
      );
    }
  });

  return (
    <div>
      <h1>{userNames[partner]}</h1>
      <div>{state}</div>
      {state === 'connected' ? (
        <button
          onClick={() => {
            if (channel) {
              channel.send('hi');
            }
          }}>
          Hi!
        </button>
      ) : null}
    </div>
  );
}
