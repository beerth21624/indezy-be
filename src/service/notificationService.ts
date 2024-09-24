import { PrismaClient, Notification } from "@prisma/client";

const prisma = new PrismaClient();

export const notificationService = {
  // Create a new notification
  async createNotification(
    userId: string,
    type: string,
    message: string
  ): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId,
        type,
        message,
        isRead: false,
      },
    });
  },

  // Get all notifications for a user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Mark a notification as read
  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<Notification | null> {
    return prisma.notification
      .updateMany({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          isRead: true,
        },
      })
      .then(async () => {
        return prisma.notification.findUnique({
          where: {
            id: notificationId,
          },
        });
      });
  },

  // Mark all notifications as read for a user
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  },

  // Delete a notification
  async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<boolean> {
    const result = await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
    return result.count > 0;
  },

  // Get unread notification count for a user
  async getUnreadNotificationCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  },

  // Get recent notifications for a user
  async getRecentNotifications(
    userId: string,
    limit: number = 5
  ): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  },

  // Delete old notifications
  async deleteOldNotifications(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        isRead: true,
      },
    });

    return result.count;
  },
};

export default notificationService;
