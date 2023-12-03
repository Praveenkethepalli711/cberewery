import { NextApiRequest, NextApiResponse } from 'next';

import { BreweryType } from '@prisma/client'; // Make sure to use the correct type from your Prisma client

const breweryTypes = Object.values(BreweryType);

const breweryTypeListHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'GET') {
    res.status(200).json(breweryTypes);
  } else {
    res.status(401).json({
      message: `HTTP method ${req.method} is not supported.`,
    });
  }
};

export default breweryTypeListHandler;
