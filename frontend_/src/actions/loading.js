import { LOADING, SKELETONLOADING } from "./types";

// LOADNING
export const loading = state => {
  return {
    type: LOADING,
    payload: state
  };
};

export const Skeletonloading = state => {
  return {
    type: SKELETONLOADING,
    payload: state
  };
};
