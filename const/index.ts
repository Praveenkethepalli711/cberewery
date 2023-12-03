export type BreweryType = {
  id: string;
  name: string;
};

export interface BreweryProps {
  id: string;
  name: string;
  type: string;
  establishedAt: string;
  stock: number;
  price: string;
  brewers: { brewer: BreweryType }[];
  averageRating: number;
  ratings: number;
}

export interface BreweryCartItemProps extends BreweryProps {
  quantity: number;
}

export type BreweryDetailProps = Omit<
  BreweryProps,
  'brewers' | 'averageRating' | 'ratings'
>;

export interface BreweryRatingsProps {
  breweryId: string;
  userId: string;
  score: number;
  ratedAt: string;
  user: {
    id: string;
    nickname: string;
  };
}

export const starLabels: { [index: string]: string } = {
  0.5: 'Avoid',
  1: 'Not Recommended',
  1.5: 'Poor',
  2: 'Below Average',
  2.5: 'Average',
  3: 'Above Average',
  3.5: 'Good',
  4: 'Very Good',
  4.5: 'Excellent',
  5: 'Outstanding',
};

export const PAGE_SIZE = 6;

export const SORT_VALUE = ['established_at', 'price'];
