export class Role {
  constructor(
    public id: string,
    public name: string,
    public parentRoleId: string | null,
    public permissions: Set<string>,
  ) {}

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      parentRoleId: this.parentRoleId,
      permissions: Array.from(this.permissions),
    };
  }
}
