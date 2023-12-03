import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  waitForNone,
} from "recoil";
import { breweryDetailsIdState, breweryListQueryState } from "atoms";
import {
  fetchBreweryDetailsById,
  fetchBreweryReviewsById,
  fetchBreweries,
} from "lib/http";

export const breweryListQuery = selector({
  key: "breweryListQuery",
  get: async ({ get }) => {
    const { page, size, city, sort } = get(breweryListQueryState);
    const response = await fetchBreweries({ page, size, city, sort });
    return response;
  },
});

export const breweryDetailsQuery = selector({
  key: "breweryDetailsQuery",
  get: async ({ get }) => {
    const breweryID = get(breweryDetailsIdState);
    const response = await fetchBreweryDetailsById(breweryID);
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

export const breweryReviewsQuery = selector({
  key: "breweryReviewsQuery",
  get: async ({ get }) => {
    const breweryID = get(breweryDetailsIdState);
    if (!breweryID) {
      throw new Error('Required breweryID');
    }
    const response = await fetchBreweryReviewsById(breweryID);
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});
