import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import CommonLayout from 'components/v2/Layout';
import { breweryDetailsIdState } from 'atoms'; // Make sure to use the correct state atom
import BreweryInfoSection from 'components/v2/BreweryDetails/BreweryInfoSection'; // Update the import path
import BreweryReviewsSection from 'components/v2/BreweryDetails/BreweryReviewsSection'; // Update the import path

const Brewery: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [, setBreweryDetailsId] = useRecoilState(breweryDetailsIdState);

  React.useEffect(() => {
    id && setBreweryDetailsId(id as string);
  }, [id, setBreweryDetailsId]);

  return (
    <>
      <Head>
        <title>Brewery Details</title>
        <meta name='description' content='Brewery Details' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <CommonLayout
        headerProps={{
          hideMenu: true,
        }}
      >
        <BreweryInfoSection />
        <BreweryReviewsSection />
      </CommonLayout>
    </>
  );
};

export default Brewery;
