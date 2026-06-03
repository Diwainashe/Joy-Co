export class AdminAuth {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async checkSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.user || null;
  }

  async login(email, password) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data?.user, error };
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  async getCurrentUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async updatePassword(newPassword) {
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    return { user: data?.user, error };
  }

  async reAuthenticate(email, password) {
    return this.login(email, password);
  }
}
