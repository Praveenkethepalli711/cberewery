import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { SetterOrUpdater } from 'recoil';

export function BreweryChip(props: any) {
  const { label, onDelete } = props;

  return (
    <div className='badge badge-ghost gap-2 cursor-default'>
      {label}
      <XMarkIcon
        className='inline-block w-4 h-4 stroke-current cursor-pointer'
        onClick={onDelete}
        tabIndex={0}
      />
    </div>
  );
}

export const FilteredBreweryChips = (props: {
  data: { city: string; name: string; type: string };
  onChange: SetterOrUpdater<{
    city: string;
    name: string;
    type: string;
  }>;
}) => {
  const { data, onChange } = props;
  const handleDelete = (key: 'city' | 'name' | 'type') => {
    onChange((originData) => ({ ...originData, [key]: '' }));
  };
  return (
    <div className='flex flex-wrap items-center justify-start gap-2 pb-4'>
      {data.city && (
        <BreweryChip
          label={`City: ${data.city}`}
          onDelete={() => {
            handleDelete('city');
          }}
        />
      )}
      {data.name && (
        <BreweryChip
          label={`Name: ${data.name}`}
          onDelete={() => {
            handleDelete('name');
          }}
        />
      )}
      {data.type && (
        <BreweryChip
          label={`Type: ${data.type}`}
          onDelete={() => {
            handleDelete('type');
          }}
        />
      )}
    </div>
  );
};
