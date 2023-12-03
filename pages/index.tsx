import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import { breweryPageBrewerySumState, breweryPageQueryState } from 'atoms';

import CommonLayout from 'components/v2/Layout';
import { FilteredChips } from 'components/v2/Chips/FilteredChips';
import BreweryList from 'components/v2/Cards/BreweryItemCardList'; // Update the import path
import Pagination from 'components/v2/Pagination';
import { PAGE_SIZE } from 'const';

const BreweryHome: NextPage = () => {
  const [breweryPageQueryData, setBreweryPageQueryData] =
    useRecoilState(breweryPageQueryState);
  const [breweryPageBrewerySum] = useRecoilState(breweryPageBrewerySumState);

  const handleClickPagination = (page: number) => {
    setBreweryPageQueryData({ ...breweryPageQueryData, page });
  };

  return (
    <>
      <Head>
        <title>Brewery Home</title>
        <meta name='description' content='Brewery Home Page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <CommonLayout>
        {(breweryPageQueryData.city || breweryPageQueryData.type) && (
          <FilteredChips
            data={breweryPageQueryData}
            onChange={setBreweryPageQueryData}
          />
        )}
        <BreweryList page={breweryPageQueryData?.page || 1} pageSize={PAGE_SIZE} />
        <div className='flex justify-center pt-6'>
          <Pagination
            currentPage={breweryPageQueryData?.page || 1}
            pages={Math.round(breweryPageBrewerySum / PAGE_SIZE)}
            onClick={handleClickPagination}
          />
        </div>
      </CommonLayout>
    </>
  );
};

export default BreweryHome;
