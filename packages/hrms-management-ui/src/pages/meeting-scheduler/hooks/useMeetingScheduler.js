import { useReducer } from "react";
import { meetingSchedulerReducer } from "../meeting-scheduler/reducer";
import { initialState } from "../meeting-scheduler/context";

export const useMeetingScheduler = () => {
  const [state, dispatch] = useReducer(meetingSchedulerReducer, initialState);
  return { state, dispatch };
};
