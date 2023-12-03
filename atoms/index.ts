import { atom } from "recoil";

export const brewerySearchState = atom({
  key: "brewerySearchState",
  default: {
    city: "",
    name: "",
    type: "",
  },
});

export const breweryDetailsState = atom({
  key: "breweryDetailsState",
  default: {
    id: "",
    name: "",
    address: "",
    phone: "",
    website: "",
    rating: 0,
    state: "",
    city: "",
  },
});

export const reviewsState = atom({
  key: "reviewsState",
  default: [],
});

export const reviewFormState = atom({
  key: "reviewFormState",
  default: {
    rating: 0,
    description: "",
  },
});

export const userAuthState = atom({
  key: "userAuthState",
  default: {
    userId: "",
    isLoggedIn: false,
  },
});

export const brewerySearchResultsState = atom({
  key: "brewerySearchResultsState",
  default: [],
});

export const currentPageState = atom({
  key: "currentPageState",
  default: "login", // Set the default page to the login page
});
