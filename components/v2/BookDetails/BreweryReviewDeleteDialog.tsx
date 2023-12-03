import * as React from 'react';
import { useSnackbar } from 'notistack';
import NextRouter from 'next/router';

import { deleteBreweryReview } from 'lib/http'; // Assuming you have a function for deleting brewery reviews

export interface BreweryReviewDeleteDialogProps {
  breweryId: string;
  userId: string;
}

const BreweryReviewDeleteDialog = React.forwardRef(
  (props: BreweryReviewDeleteDialogProps, ref: any) => {
    const { breweryId, userId } = props;
    const [loading, setLoading] = React.useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
      ref?.current?.close();
    };

    const handleDelete = async (e: any) => {
      e.preventDefault();

      setLoading(true);
      const response = await deleteBreweryReview(props.breweryId, props.userId);
      if (response.error) {
        enqueueSnackbar(`Error: Delete target review.`, {
          variant: 'error',
        });
        setLoading(false);
        handleClose();
        return;
      }
      enqueueSnackbar(`The review was successfully deleted.`, {
        variant: 'success',
      });
      setLoading(false);
      handleClose();
      NextRouter.reload();
    };

    return (
      <dialog id={userId} className='modal' ref={ref}>
        <form method='dialog' className='modal-box'>
          <h3 className='font-bold text-lg'>
            Delete this review?{`[userID: ${userId}]`}
          </h3>
          <p className='py-4'>This operation is not reversible.</p>

          <div className='modal-action'>
            <button className='btn'>Cancel</button>
            <button
              className='btn btn-error'
              disabled={loading}
              onClick={handleDelete}
            >
              {loading && <span className='loading loading-spinner' />}
              Delete
            </button>
          </div>
        </form>
      </dialog>
    );
  }
);

BreweryReviewDeleteDialog.displayName = 'BreweryReviewDeleteDialog';

export default BreweryReviewDeleteDialog;
