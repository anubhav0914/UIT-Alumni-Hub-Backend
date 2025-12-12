import { prisma } from "../../lib/prisma.js";

export class SessionRepository {
  
  // CREATE: Create a new session (login)
  async createSession(data) {
    return prisma.authSession.create({
      data,
    });
  }

  // READ: Get a session by ID
  async getSessionById(id) {
    return prisma.authSession.findUnique({
      where: { id },
    });
  }

  // READ: Get all sessions for a user
  async getSessionsByUser(userId) {
    return prisma.authSession.findMany({
      where: { user_id: userId },
    });
  }

  // READ: Find session by refresh token hash (recommended)
  async getSessionByRefreshToken(hash) {
    return prisma.authSession.findFirst({
      where: { refresh_token_hash: hash },
    });
  }

  // UPDATE: Update session fields (ex: expire session)
  async updateSession(id, data) {
    return prisma.authSession.update({
      where: { id },
      data,
    });
  }

  // DELETE: Delete a session (logout)
  async deleteSession(id) {
    return prisma.authSession.delete({
      where: { id },
    });
  }

  // DELETE MANY: Remove expired sessions
  async deleteExpiredSessions() {
    return prisma.authSession.deleteMany({
      where: {
        expires_at: { lt: new Date() },
      },
    });
  }
}
