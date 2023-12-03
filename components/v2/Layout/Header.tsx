import * as React from 'react';
import NextLink from 'next/link';
import {
  Bars3Icon,
  ShoppingCartIcon,
  BeerIcon, // Replace with your brewery-related icon
} from '@heroicons/react/24/outline';

import BreweryTypeMenu from 'components/v2/Layout/BreweryTypeMenu';
import { breweryCartState } from 'atoms'; // Replace with your corresponding atom
import { useRecoilState } from 'recoil';

// Replace with your corresponding utility function
import { calcBreweryCartItemSum } from 'lib/utils';

export interface HeaderProps {
  hideMenu?: boolean;
}

export default function Header(props: HeaderProps) {
  const { hideMenu } = props;

  const [breweryCart, setBreweryCart] = useRecoilState(breweryCartState);

  return (
    <>
      <div className='navbar bg-base-100 mx-auto max-w-7xl mt-4 shadow-xl rounded-box'>
        <div className='navbar-start'>
          {!hideMenu && (
            <div className='dropdown'>
              <label
                tabIndex={0}
                className='btn btn-ghost btn-circle content-center'
              >
                <Bars3Icon className='w-6 h-6' />
              </label>
              <BreweryTypeMenu />
            </div>
          )}
        </div>
        <div className='navbar-center'>
          <NextLink href='/' className='btn btn-ghost normal-case text-xl'>
            <BeerIcon className='w-6 h-6' /> {/* Replace with your brewery-related icon */}
            Brewery Reviews
          </NextLink>
        </div>
        <div className='navbar-end'>
          <NextLink href='/cart' className='btn btn-ghost btn-circle'>
            <div className='indicator'>
              <ShoppingCartIcon className='w-6 h-6' />
              <span className='badge badge-sm indicator-item'>
                {calcBreweryCartItemSum(breweryCart)} {/* Update to your utility function */}
              </span>
            </div>
          </NextLink>

          {/* Include other components/buttons specific to your Brewery Review System */}
        </div>
      </div>
    </>
  );
}
