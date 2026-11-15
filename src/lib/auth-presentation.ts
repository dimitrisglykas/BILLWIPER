/** Managed Google sign-in is offered only on the hosting that serves its handlers. */
export function supportsManagedGoogle(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === 'lovable.app' || host.endsWith('.lovable.app');
}