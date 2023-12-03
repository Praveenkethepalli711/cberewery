import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import prisma from '../../../../lib/prisma';

const breweryReviewHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'GET') {
    try {
      res.status(200).json(await getBreweryReviews(req));
    } catch (err: any) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  } else if (req.method === 'POST') {
    try {
      await addBreweryReview(req, res);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await removeBreweryReview(req, res);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  } else {
    res.status(401).json({
      message: `HTTP method ${req.method} is not supported`,
    });
  }
};

async function getBreweryReviews(req: NextApiRequest) {
  // Get breweryID;
  if (typeof req.query.id !== 'string' && typeof req.query.id !== 'number') {
    throw new Error('Invalid parameter `id`.');
  }
  const breweryId = BigInt(req.query.id);

  // Querying with joins. (Many to one relation)
  const reviews: any[] = await prisma.rating.findMany({
    where: {
      breweryId: breweryId,
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });

  // Counting.
  const total = await prisma.rating.count({
    where: {
      breweryId: {
        equals: breweryId,
      },
    },
  });

  return {
    content: reviews,
    total: total,
  };
}

async function addBreweryReview(
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

  // TODO: get user ID from context.
  if (
    typeof req.query.userId !== 'string' &&
    typeof req.query.userId !== 'number'
  ) {
    throw new Error('Invalid parameter `userId`.');
  }
  const userId = BigInt(req.query.userId);

  const { score } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Found the brewery for which the user wants to add a review.
      const brewery = await prisma.brewery.findFirst({
        where: {
          id: breweryId,
        },
      });

      if (!brewery) {
        throw new Error(`Can not find the brewery <${breweryId}> to review.`);
      }

      // Check if the score is valid (e.g., between 0 and 5).
      if (score < 0 || score > 5) {
        throw new Error(
          'Invalid review score. Score must be between 0 and 5.'
        );
      }

      // Add the review.
      const review = await prisma.rating.create({
        data: {
          breweryId: breweryId,
          userId: userId,
          score: score,
        },
      });

      return {
        userId: userId,
        breweryId: breweryId,
        breweryName: brewery.name,
        score: score,
        reviewId: review.id,
      };
    });

    res.status(200).json({
      message: `User <${userId}> added a review for brewery <${breweryId}> successfully.`,
      data: result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      message: `Failed to add a review for brewery ${breweryId} for user ${userId}: ${err.message}`,
    });
  }
}

async function removeBreweryReview(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Get breweryID;
  if (typeof req.query.id !== 'string' && typeof req.query.id !== 'number') {
    throw new Error('Invalid parameter `id`.');
  }
  const breweryId = BigInt(req.query.id);

  // Get userID;
  if (
    typeof req.query.userId !== 'string' &&
    typeof req.query.userId !== 'number'
  ) {
    throw new Error('Parameter `userId` must be provided.');
  }
  let userId = BigInt(req.query.userId);

  // Delete a single rating record.
  // Reference: https://www.pris
