import { createReducer } from '../../utils/createReducer';

export const { reducer: alumniReducer, initialState } = createReducer({
  featureName: 'alumni',
  initialFeatureState: {
    tab: 'directory',
    search: '',
    industry: 'All Industries',
  },
  handlers: {
    SET_TAB: (state, action) => ({ ...state, tab: action.tab }),
    SET_SEARCH: (state, action) => ({ ...state, search: action.search }),
    SET_INDUSTRY: (state, action) => ({ ...state, industry: action.industry }),
  },
});
