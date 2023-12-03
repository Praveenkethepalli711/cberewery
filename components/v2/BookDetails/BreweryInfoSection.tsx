// ... (import statements remain unchanged)

export default function BreweryInfoSection() {
  const [breweryDetailsState, setBreweryDetailsState] = React.useState<
    BreweryDetailProps | undefined
  >();
  const breweryInfoDialogRef = React.useRef<HTMLDialogElement>(null);

  const breweryDetailsLoadable = useRecoilValueLoadable(breweryInfoQuery);

  const handleUpdate = (data: BreweryDetailProps) => {
    setBreweryDetailsState(data);
  };

  switch (breweryDetailsLoadable.state) {
    case 'hasValue':
      const data = breweryDetailsLoadable.contents.content;
      return (
        <>
          <div className='text-sm breadcrumbs'>
            {/* ... (unchanged) */}
          </div>

          <div className='hero h-auto justify-start shadow-xl rounded-box'>
            <div className='hero-content flex-col lg:flex-row'>
              {/* ... (unchanged) */}
            </div>
          </div>

          {data && (
            <BreweryInfoDialog
              key={`${data.id}-${data.stock}`}
              id='edit_brewery_detail'
              ref={breweryInfoDialogRef}
              data={data}
              onSuccess={handleUpdate}
            />
          )}
        </>
      );
    // ... (remaining cases remain unchanged)
  }
}
