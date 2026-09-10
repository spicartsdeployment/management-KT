import { createReducer } from "../../utils/createReducer";

const meetingSchedulerSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_MEETINGS":
      return { ...state, meetings: action.payload };
    case "SET_SCHEDULE":
      return { ...state, schedule: action.payload };
    case "SET_CREATE_FORM":
      return { ...state, createForm: { ...state.createForm, ...action.payload } };
    default:
      return null;
  }
};

export const meetingSchedulerReducer = createReducer(meetingSchedulerSpecificHandler);
