import * as React from 'react';
import { useSnackbar } from 'notistack';
import NextRouter from 'next/router';

import { addReviewByBreweryID } from 'lib/http'; // Assuming you have a function for adding reviews
import HalfRating from 'components/v2/Rating/HalfRating';

export interface BreweryAddReviewDialog {
  breweryId: string;
}

const BreweryAddReviewDialog = React.forwardRef(
  (props: BreweryAddReviewDialog, ref: any) => {
    const { breweryId } = props;
    const [loading, setLoading] = React.useState(false);
    const [rating, setRating] = React.useState<number | null>(null);
    const [description, setDescription] = React.useState('');

    const { enqueueSnackbar } = useSnackbar();

    const handleRatingChange = (newRating: number | null) => {
      setRating(newRating);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    };

    const handleClose = () => {
      ref?.current?.close();
    };

    const handleAddReview = async (e: React.FormEvent) => {
      e.preventDefault();

      setLoading(true);
      const response = await addReviewByBreweryID(props.breweryId, {
        rating: rating as number,
        description: description,
      });
      if (response.error) {
        enqueueSnackbar(`Error: Add review.`, {
          variant: 'error',
        });
        setLoading(false);
        handleClose();
        return;
      }
      enqueueSnackbar(`The review was successfully added.`, {
        variant: 'success',
      });
      setLoading(false);
      handleClose();
      NextRouter.reload();
    };

    return (
      <dialog id={breweryId} className='modal' ref={ref}>
        <form method='dialog' className='modal-box'>
          <h3 className='font-bold text-lg pb-6'>Add Review</h3>
          <HalfRating onChange={handleRatingChange} />
          <span className='pl-2'>{rating}</span>

          <div className='form-group'>
            <label htmlFor='description'>Description:</label>
            <input
              type='text'
              id='description'
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          <div className='modal-action'>
            <button className='btn'>Cancel</button>
            <button
              className='btn btn-error'
              disabled={loading || !rating}
              onClick={handleAddReview}
            >
              {loading && <span className='loading loading-spinner' />}
              Save
            </button>
          </div>
        </form>
      </dialog>
    );
  }
);

BreweryAddReviewDialog.displayName = 'BreweryAddReviewDialog';

export default BreweryAddReviewDialog;
