import * as React from 'react';
import { useSnackbar } from 'notistack';

import { BreweryDetailProps } from 'const';
import { updateBreweryDetails } from 'lib/http'; // Assuming you have a function for updating brewery details

export interface BreweryInfoDialogProps {
  data: BreweryDetailProps;
  id: string;
  onSuccess?: (data: BreweryDetailProps) => void;
}

const BreweryInfoDialog = React.forwardRef(
  (props: BreweryInfoDialogProps, ref: any) => {
    const { data, id, onSuccess } = props;

    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState(data.description);

    const { enqueueSnackbar } = useSnackbar();

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    };

    const handleUpdate = async (event: React.FormEvent) => {
      event.preventDefault();

      setIsUpdating(true);
      const res = await updateBreweryDetails(data.id, {
        description: description,
        // Add other properties that you may want to update
      });
      if (res.error) {
        enqueueSnackbar(`Error: Update brewery details.`, {
          variant: 'error',
        });
        setIsUpdating(false);
        return;
      }
      enqueueSnackbar(`Brewery details were updated.`, {
        variant: 'success',
      });
      res.content?.data && onSuccess && onSuccess(res.content.data);
      setIsUpdating(false);

      ref?.current?.close();
    };

    return (
      <dialog id={id} className='modal' ref={ref}>
        <form method='dialog' className='modal-box'>
          <h3 className='font-bold text-lg'>Edit Brewery Details</h3>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Brewery Name</span>
            </label>
            <input
              type='text'
              className='input input-sm input-bordered w-full max-w-xs'
              value={data.name}
              disabled
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Brewery Address</span>
            </label>
            <input
              type='text'
              className='input input-sm input-bordered w-full max-w-xs'
              value={data.address}
              disabled
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Description</span>
            </label>
            <textarea
              className='textarea textarea-bordered textarea-sm w-full max-w-xs'
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          {/* Add other fields for editing */}
          <div className='modal-action'>
            <button className='btn'>Cancel</button>
            <button
              className='btn btn-info'
              disabled={isUpdating}
              onClick={handleUpdate}
            >
              {isUpdating && <span className='loading loading-spinner' />}
              Update
            </button>
          </div>
        </form>
      </dialog>
    );
  }
);

BreweryInfoDialog.displayName = 'BreweryInfoDialog';

export default BreweryInfoDialog;
