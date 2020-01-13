import React, { memo } from 'react';
import * as Status from '@musedlab/midi/message/statuses';
import { Names } from './data/messageNames';

const memoizedFilters = memo(Filters);
export { memoizedFilters as Filters };

function Filters({
  midiFilter,
  setMidiFilter,
  statusFilter,
  setStatusFilter,
  midiInputs
}) {
  return (
    <aside className="filters">
      <h2>Incoming Message Filters</h2>
      <h3>MIDI Input</h3>
      <FilterList filter={midiFilter} changeFilter={setMidiFilter}>
        {midiInputs.map(({ id, name, manufacturer }) => (
          <Filter id={id}>
            {manufacturer} {name}
          </Filter>
        ))}
      </FilterList>
      <h3>Message Type</h3>
      <FilterList filter={statusFilter} changeFilter={setStatusFilter}>
        <StatusFilter id={Status.NOTE_OFF} />
        <StatusFilter id={Status.NOTE_ON} />
        <StatusFilter id={Status.KEY_PRESSURE} />
        <StatusFilter id={Status.CONTROL_CHANGE} />
        <StatusFilter id={Status.PROGRAM_CHANGE} />
        <StatusFilter id={Status.CHANNEL_PRESSURE} />
        <StatusFilter id={Status.PITCH_BEND} />
        <StatusFilter id={Status.SYSTEM_EXCLUSIVE} />
        <StatusFilter id={Status.MIDI_TIME_CODE} />
        <StatusFilter id={Status.SONG_POSITION} />
        <StatusFilter id={Status.SONG_SELECT} />
        <StatusFilter id={Status.TUNE_REQUEST} />
        <StatusFilter id={Status.TIMING_CLOCK} />
        <StatusFilter id={Status.START} />
        <StatusFilter id={Status.CONTINUE} />
        <StatusFilter id={Status.STOP} />
        <StatusFilter id={Status.ACTIVE_SENSING} />
        <StatusFilter id={Status.RESET} />
      </FilterList>
    </aside>
  );
}

function FilterList({ filter, changeFilter, children }) {
  return (
    <ul>
      {children.map(child =>
        React.cloneElement(child, {
          key: child.props.id,
          value: filter[child.props.id],
          onChange: value => {
            changeFilter(filter => ({ ...filter, [child.props.id]: value }));
          }
        })
      )}
    </ul>
  );
}

function StatusFilter(props) {
  return <Filter {...props}>{Names[props.id]}</Filter>;
}

function Filter({ value, onChange, children }) {
  return (
    <li>
      <label>
        <input
          className="toggle"
          type="checkbox"
          checked={value}
          onChange={e => {
            onChange(e.target.checked);
          }}></input>
        <span>{children}</span>
      </label>
    </li>
  );
}
