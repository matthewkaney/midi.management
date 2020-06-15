import React, { memo } from 'react';
import { MessageTypes } from './names/messageTypes';

const memoizedFilters = memo(Filters);
export { memoizedFilters as Filters };

function Filters({
  midiFilter,
  setMidiFilter,
  statusFilter,
  setStatusFilter,
  midiInputs,
}) {
  return (
    <aside className="filters">
      <h3>Filter Input</h3>
      <FilterList filter={midiFilter} changeFilter={setMidiFilter}>
        {midiInputs.map(({ id, name, manufacturer }) => (
          <Filter key={id} id={id}>
            {manufacturer} {name}
          </Filter>
        ))}
      </FilterList>
      <h3>Filter Message Type</h3>
      <FilterList filter={statusFilter} changeFilter={setStatusFilter}>
        <StatusFilter id={0x80} />
        <StatusFilter id={0x90} />
        <StatusFilter id={0xa0} />
        <StatusFilter id={0xb0} />
        <StatusFilter id={0xc0} />
        <StatusFilter id={0xd0} />
        <StatusFilter id={0xe0} />
        <StatusFilter id={0xf0} />
        <StatusFilter id={0xf1} />
        <StatusFilter id={0xf2} />
        <StatusFilter id={0xf3} />
        <StatusFilter id={0xf6} />
        <StatusFilter id={0xf8} />
        <StatusFilter id={0xfa} />
        <StatusFilter id={0xfb} />
        <StatusFilter id={0xfc} />
        <StatusFilter id={0xfe} />
        <StatusFilter id={0xff} />
      </FilterList>
    </aside>
  );
}

function FilterList({ filter, changeFilter, children }) {
  return (
    <ul>
      {children.map((child) =>
        React.cloneElement(child, {
          key: child.props.id,
          value: filter[child.props.id],
          onChange: (value) => {
            changeFilter((filter) => ({ ...filter, [child.props.id]: value }));
          },
        })
      )}
    </ul>
  );
}

function StatusFilter(props) {
  return <Filter {...props}>{MessageTypes.get(props.id)}</Filter>;
}

function Filter({ value, onChange, children }) {
  return (
    <li>
      <label>
        <input
          className="toggle"
          type="checkbox"
          checked={value}
          onChange={(e) => {
            onChange(e.target.checked);
          }}></input>
        <span>{children}</span>
      </label>
    </li>
  );
}
