import { useCallback } from 'react';

/**
 * useGrievanceModals - Modal state and action handlers
 * @param {Function} dispatch - Reducer dispatch function
 * @returns {Object} Modal handlers
 */
export const useGrievanceModals = (dispatch) => {
  // Open modals
  const openAssignModal = useCallback((grievanceId) => {
    dispatch({
      type: 'SET_MODAL',
      payload: { type: 'assign', data: { grievanceId } },
    });
  }, [dispatch]);

  const openEscalateModal = useCallback((grievanceId) => {
    dispatch({
      type: 'SET_MODAL',
      payload: { type: 'escalate', data: { grievanceId } },
    });
  }, [dispatch]);

  const openResolveModal = useCallback((grievanceId) => {
    dispatch({
      type: 'SET_MODAL',
      payload: { type: 'resolve', data: { grievanceId } },
    });
  }, [dispatch]);

  const openNoteModal = useCallback((grievanceId) => {
    dispatch({
      type: 'SET_MODAL',
      payload: { type: 'note', data: { grievanceId } },
    });
  }, [dispatch]);

  const openBulkActionModal = useCallback(() => {
    dispatch({
      type: 'SET_MODAL',
      payload: { type: 'bulk', data: {} },
    });
  }, [dispatch]);

  const openConfirmModal = useCallback((title, message, onConfirm, onCancel) => {
    dispatch({
      type: 'SET_MODAL',
      payload: {
        type: 'confirm',
        data: { title, message, onConfirm, onCancel },
      },
    });
  }, [dispatch]);

  // Close modal
  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, [dispatch]);

  return {
    openAssignModal,
    openEscalateModal,
    openResolveModal,
    openNoteModal,
    openBulkActionModal,
    openConfirmModal,
    closeModal,
  };
};

/**
 * useGrievanceDrawer - Drawer state and handlers
 * @param {Function} dispatch - Reducer dispatch function
 * @returns {Object} Drawer handlers
 */
export const useGrievanceDrawer = (dispatch) => {
  const openDrawer = useCallback((grievanceId) => {
    dispatch({ type: 'OPEN_DRAWER', payload: grievanceId });
  }, [dispatch]);

  const closeDrawer = useCallback(() => {
    dispatch({ type: 'CLOSE_DRAWER' });
  }, [dispatch]);

  return { openDrawer, closeDrawer };
};

/**
 * useGrievanceToast - Toast notification handlers
 * @param {Function} dispatch - Reducer dispatch function
 * @returns {Object} Toast handlers
 */
export const useGrievanceToast = (dispatch) => {
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    dispatch({
      type: 'SET_TOAST',
      payload: { message, type },
    });

    // Auto-dismiss after duration
    setTimeout(() => {
      dispatch({ type: 'CLEAR_TOAST' });
    }, duration);
  }, [dispatch]);

  const clearToast = useCallback(() => {
    dispatch({ type: 'CLEAR_TOAST' });
  }, [dispatch]);

  return { showToast, clearToast };
};

/**
 * useGrievanceActions - Grievance action handlers
 * @param {Function} dispatch - Reducer dispatch function
 * @returns {Object} Action handlers
 */
export const useGrievanceActions = (dispatch) => {
  const assignGrievance = useCallback((grievanceId, roleId) => {
    dispatch({
      type: 'ASSIGN_GRIEVANCE',
      payload: { grievanceId, roleId },
    });
  }, [dispatch]);

  const reassignGrievance = useCallback((grievanceId, roleId) => {
    dispatch({
      type: 'REASSIGN_GRIEVANCE',
      payload: { grievanceId, roleId },
    });
  }, [dispatch]);

  const escalateGrievance = useCallback((grievanceId) => {
    dispatch({
      type: 'ESCALATE_GRIEVANCE',
      payload: grievanceId,
    });
  }, [dispatch]);

  const resolveGrievance = useCallback((grievanceId, outcome) => {
    dispatch({
      type: 'RESOLVE_GRIEVANCE',
      payload: { grievanceId, outcome },
    });
  }, [dispatch]);

  const closeGrievance = useCallback((grievanceId) => {
    dispatch({
      type: 'CLOSE_GRIEVANCE',
      payload: grievanceId,
    });
  }, [dispatch]);

  const addInternalNote = useCallback((grievanceId, author, content) => {
    dispatch({
      type: 'ADD_INTERNAL_NOTE',
      payload: { grievanceId, author, content },
    });
  }, [dispatch]);

  const bulkAssign = useCallback((roleId) => {
    dispatch({
      type: 'BULK_ASSIGN',
      payload: { roleId },
    });
  }, [dispatch]);

  const bulkResolve = useCallback(() => {
    dispatch({ type: 'BULK_RESOLVE' });
  }, [dispatch]);

  const bulkClose = useCallback(() => {
    dispatch({ type: 'BULK_CLOSE' });
  }, [dispatch]);

  return {
    assignGrievance,
    reassignGrievance,
    escalateGrievance,
    resolveGrievance,
    closeGrievance,
    addInternalNote,
    bulkAssign,
    bulkResolve,
    bulkClose,
  };
};
