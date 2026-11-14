'use client';

import { useEffect, useState } from 'react';

export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const response = await fetch('/api/admin/me', { cache: 'no-store' });
        const json = await response.json();
        setIsAdmin(response.ok && json.success && json.data?.is_admin === true);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    check();
  }, []);

  return isAdmin;
};
