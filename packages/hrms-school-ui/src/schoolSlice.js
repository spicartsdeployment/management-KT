import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	theme: 'light',
	sidebarCollapsed: false,
	notifications: [],
	selectedStudent: null,
	announcementUnreadCount: 0,
	seenAnnouncementIds: [],
};

const schoolSlice = createSlice({
	name: 'school',
	initialState,
	reducers: {
		toggleTheme(state) {
			state.theme = state.theme === 'light' ? 'dark' : 'light';
		},
		setTheme(state, action) {
			state.theme = action.payload;
		},
		toggleSidebar(state) {
			state.sidebarCollapsed = !state.sidebarCollapsed;
		},
		addNotification(state, action) {
			state.notifications.push(action.payload);
		},
		setSelectedStudent(state, action) {
			state.selectedStudent = action.payload;
		},
		setAnnouncementUnreadCount(state, action) {
			state.announcementUnreadCount = action.payload;
		},
		markAnnouncementsSeen(state, action) {
			action.payload.forEach((id) => {
				if (!state.seenAnnouncementIds.includes(id)) {
					state.seenAnnouncementIds.push(id);
				}
			});
		},
	},
});

export const {
	toggleTheme,
	setTheme,
	toggleSidebar,
	addNotification,
	setSelectedStudent,
	setAnnouncementUnreadCount,
	markAnnouncementsSeen,
} = schoolSlice.actions;

export const selectTheme = (state) => state.school.theme;
export const selectSidebarCollapsed = (state) => state.school.sidebarCollapsed;
export const selectNotifications = (state) => state.school.notifications;
export const selectSelectedStudent = (state) => state.school.selectedStudent;
export const selectAnnouncementUnreadCount = (state) => state.school.announcementUnreadCount;
export const selectSeenAnnouncementIds = (state) => state.school.seenAnnouncementIds;

export default schoolSlice.reducer;