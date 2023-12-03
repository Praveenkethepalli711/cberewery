import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import axios from 'axios';

const ALLOW_UPDATE_FIELDS = ['type', 'price', 'stock', 'establishedAt'];

const breweryDetailHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  switch (req.method) {
    case 'GET':
      try {
        res.status(200).json(await getBreweryDetail(req));
      } catch (err: any) {
        console.error(err);
        res.status(500).json({
          message: err.message,
        });
      }
      break;
    case 'PUT':
      try {
        await updateBreweryDetail(req, res);
      } catch (err: any) {
        console.error(err);
        res.status(500).json({
          message: err.message,
        });
      }
      break;
    default:
      res.status(401).json({
        message: `HTTP method ${req.method} is not supported.`,
      });
  }
};

async function getBreweryDetail(req: NextApiRequest) {
  // Get breweryID;
  if (typeof req.query.id !== 'string' && typeof req.query.id !== 'number') {
    throw new Error('Invalid parameter `id`.');
  }
  const breweryId = BigInt(req.query.id);

  // Get record by unique identifier.
  const brewery: any = await prisma.brewery.findUnique({
    where: {
      id: breweryId,
    },
  });

  // Aggregation.
  const averageRating = await prisma.rating.aggregate({
    _avg: {
      score: true,
    },
    where: {
      breweryId: {
        equals: breweryId,
      },
    },
  });
  brewery.averageRating = averageRating._avg.score;

  return brewery;
}

async function updateBreweryDetail(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Get breweryID;
  if (typeof req.query.id !== 'string' && typeof req.query.id !== 'number') {
    throw new Error('Invalid parameter `id`.');
  }
  const breweryId = BigInt(req.query.id);

  if (req.body == null || typeof req.body !== 'object') {
    throw new Error('Invalid parameters.');
  }

  const updateData: any = {};
  for (const [key, value] of Object.entries(req.body)) {
    if (ALLOW_UPDATE_FIELDS.includes(key)) {
      updateData[key] = value;
    }
  }

  const result = await prisma.brewery.update({
    data: updateData,
    where: {
      id: breweryId,
    },
  });

  res.status(200).json({
    message: 'success',
    data: result,
  });
}

const searchBreweryByCity = async (city: string) => {
  const apiUrl = `https://api.openbrewerydb.org/breweries?by_city=${city}`;
  const response = await axios.get(apiUrl);
  return response.data;
};

const addBreweryReview = async (
  breweryId: bigint,
  userId: string,
  score: number
) => {
  const result = await prisma.rating.create({
    data: {
      breweryId: breweryId,
      userId: userId,
      score: score,
    },
  });
  return result;
};

export { breweryDetailHandler, searchBreweryByCity, addBreweryReview };
export default breweryDetailHandler;
