import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { roleManagementReducer } from "./reducer";

export const RoleManagementContext = React.createContext();

export const initialState = createInitialState({
  roles: [],
  permissions: [],
});

export { roleManagementReducer as reducer };
  }
};
