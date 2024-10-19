export const JobRequestStatuses = {
  ACCEPTED: 'ACCEPTED',
  NOTIFYING: 'NOTIFYING',
  DECLINED: 'DECLINED',
};

export const JobStatuses = {
  //Mechanic has arrived destination and has started working on it
  IN_PROGRESS: 'IN_PROGRESS',
  // once mechanic has accepted and starts coming
  ON_THE_WAY: 'ON_THE_WAY',
  //Unaccepted job that's not attached yet to a mechanic
  NOTIFYING: 'NOTIFYING',
  COMPLETED: 'COMPLETED',
  // No mechanic could resolve the issue
  CANCELED: 'CANCELED',
};

export const MechanicStatuses = {
  ACCEPTED: 'APPROVED',
  NOTIFYING: 'UNAPPROVED',
  DECLINED: 'OUT_OF_SERVICE',
  BANNED: 'BANNED',
};

export const UserRoles = {
  client: 'client',
  mechanic: 'mechanic',
  admin: 'admin',
};
