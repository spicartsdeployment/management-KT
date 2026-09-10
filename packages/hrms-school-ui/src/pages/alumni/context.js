import React from 'react';
import { alumniReducer, initialState } from './reducer';

export const AlumniContext = React.createContext();

export { alumniReducer as reducer, initialState };
