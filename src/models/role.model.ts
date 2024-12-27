export class Role {
  constructor(
    public id: string,
    public name: string,
    public parentRoleId: string | null,
    public permissions: Set<string>,
  ) {}
}
