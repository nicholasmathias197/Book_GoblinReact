import { useState, useCallback } from 'react';
import { adminAPI } from '../utils/api';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAdminStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const stats = await adminAPI.getStats();
      return { success: true, data: stats };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllUsers = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const users = await adminAPI.getAllUsers(page, size);
      return { success: true, data: users };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId, role) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await adminAPI.updateUserRole(userId, role);
      return { success: true, data: result };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      await adminAPI.deactivateUser(userId);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getActivityLogs = useCallback(async (page = 0, size = 50) => {
    setLoading(true);
    setError(null);
    
    try {
      const logs = await adminAPI.getActivityLogs(page, size);
      return { success: true, data: logs };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAdminStats,
    getAllUsers,
    updateUserRole,
    deactivateUser,
    getActivityLogs,
  };
};