import * as React from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import { breweryDetailsIdState } from 'atoms'; // Assuming you have an atom for storing brewery details ID
import { breweryReviewQuery } from 'selectors'; // Assuming you have a selector for fetching brewery reviews
import { BreweryReviewsProps } from 'const'; // Update with the appropriate type for brewery reviews
import BreweryAddReviewDialog from 'components/v2/BreweryDetails/BreweryAddReviewDialog'; // Update with the appropriate path

export default function BreweryReviewsSection() {
  const addReviewDialogRef = React.useRef<HTMLDialogElement>(null);

  const breweryReviewLoadable = useRecoilValueLoadable(breweryReviewQuery);
  const [breweryDetailsId] = useRecoilState(breweryDetailsIdState);

  switch (breweryReviewLoadable.state) {
    case 'hasValue':
      const data = breweryReviewLoadable.contents.content;
      return (
        <>
          <div className='hero h-auto justify-start mt-6'>
            <div className='hero-content items-start'>
              <div className='max-w-md'>
                <h2 className='text-3xl font-bold'>Customer Reviews</h2>
                <p className='py-6'>
                  <ReviewOverview content={data.content} />
                </p>
                <button
                  className='btn btn-info'
                  onClick={() => {
                    addReviewDialogRef?.current?.showModal();
                  }}
                >
                  Add Review
                </button>
              </div>
              <div className='overflow-x-auto mt-16'>
                {data?.content?.length > 0 && (
                  <ReviewsTable content={data.content} breweryId={breweryDetailsId} />
                )}
              </div>
            </div>
          </div>
          <BreweryAddReviewDialog
            breweryId={breweryDetailsId}
            ref={addReviewDialogRef}
          />
        </>
      );
    case 'loading':
      return (
        <>
          <div className='flex items-center justify-center mt-6'>
            <span className='loading loading-bars loading-lg'></span>
          </div>
        </>
      );
    case 'hasError':
      // throw breweryReviewLoadable.contents;
      return <></>;
  }
}

const ReviewOverview = (props: { content: BreweryReviewsProps[] }) => {
  const num = props.content.length;
  const sum = props.content.reduce((prev, item) => {
    return prev + item.rating;
  }, 0);
  const avg = sum / num;
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center py-2'>
        {/* Assuming you have a component for displaying ratings */}
        <div>{/* Replace this with your rating component */}</div>
        <div className='ml-2'>{/* Assuming you have a function to convert avg to stars */}</div>
      </div>
      <div className='text-sm text-gray-500'>{`${num} global ratings`}</div>
      {/* Similar to BookReviewsSection, update the StarPercentageBar component */}
      {/* based on the rating values in your BreweryReviewsProps */}
    </div>
  );
};

const ReviewsTable = (props: {
  content: BreweryReviewsProps[];
  breweryId: string;
}) => {
  const { content, breweryId } = props;
  const [targetUserId, setTargetUserId] = React.useState<string | null>(null);

  const deleteDialogRef = React.useRef<HTMLDialogElement>(null);

  const handleDelete = (userId: string) => () => {
    setTargetUserId(userId);
    deleteDialogRef.current?.showModal();
  };

  return (
    <>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {content.map((item) => (
            <tr key={item.userId}>
              <td>
                <div className='flex items-center space-x-3'>
                  {/* Assuming you have a component for displaying user details */}
                  <div>{/* Replace this with your user details component */}</div>
                  <div>
                    <div className='font-bold'>{item.user.nickname}</div>
                    <div className='text-sm opacity-50'>
                      User ID: {item.user.id}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                {/* Assuming you have a component for displaying ratings */}
                <div>{/* Replace this with your rating component */}</div>
              </td>
              <td>{`${new Date(item.date).toLocaleDateString()}`}</td>
              <th>
                <button
                  className='btn btn-error btn-xs'
                  onClick={handleDelete(item.userId)}
                >
                  delete
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      {targetUserId && (
        <BreweryReviewDeleteDialog
          breweryId={breweryId}
          userId={targetUserId}
          ref={deleteDialogRef}
        />
      )}
    </>
  );
};
