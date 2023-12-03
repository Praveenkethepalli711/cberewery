import * as React from 'react';
import { useSnackbar } from 'notistack';

import { useRecoilState } from 'recoil';
import { breweryTypeListState, searchPageQueryState } from 'atoms';
import clsx from 'clsx';

import { fetchBreweryTypes } from 'lib/http';

export default function BreweryTypeMenu() {
  const [loadingBreweryType, setLoadingBreweryType] = React.useState(false);

  const [breweryTypeList, setBreweryTypeList] = useRecoilState(
    breweryTypeListState
  );
  const [searchPageQueryData, setSearchPageQueryData] = useRecoilState(
    searchPageQueryState
  );
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const func = async () => {
      setLoadingBreweryType(true);
      const res = await fetchBreweryTypes();
      const { error, content } = res;
      if (error) {
        setLoadingBreweryType(false);
        enqueueSnackbar(`Error: Fetch Brewery Types`, {
          variant: 'error',
        });
        return;
      }
      setBreweryTypeList(content);
      setLoadingBreweryType(false);
    };
    !breweryTypeList.length && func();
  }, [breweryTypeList.length, enqueueSnackbar, setBreweryTypeList]);

  return (
    <>
      <ul
        tabIndex={0}
        className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
      >
        <li>
          <div className='menu-title'>Brewery Type</div>
          <ul>
            {breweryTypeList.map((breweryType) => (
              <li
                key={breweryType}
                onClick={() => {
                  setSearchPageQueryData({
                    ...searchPageQueryData,
                    page: 1,
                    type: breweryType,
                  });
                }}
              >
                <span
                  className={clsx({
                    active: searchPageQueryData.type === breweryType,
                  })}
                >
                  {breweryType.replaceAll(`_nbsp_`, ` `).replaceAll(`_amp_`, `&`)}
                </span>
              </li>
            ))}
          </ul>
        </li>

        {/* You might want to customize this part based on your Brewery Review System requirements */}
      </ul>
    </>
  );
}
