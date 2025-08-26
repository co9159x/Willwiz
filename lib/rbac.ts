export function hasRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    'broker': 1,
    'broker_admin': 2,
    'platform_admin': 3,
  };

  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

export function requireRole(userRole: string, requiredRole: string) {
  if (!hasRole(userRole, requiredRole)) {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}`);
  }
}