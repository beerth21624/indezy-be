"use strict";
// import { Request, Response } from "express";
// import { notificationService } from "../service/notificationService";
// import { AuthenticatedRequest } from "../middleware/authMiddleware";
// export const notificationController = {
//   // Create a new notification
//   async createNotification(req: Request, res: Response) {
//     try {
//       const { userId, type, message } = req.body;
//       const notification = await notificationService.createNotification(
//         userId,
//         type,
//         message
//       );
//       res.status(201).json(notification);
//     } catch (error) {
//       console.error("Error creating notification:", error);
//       res.status(500).json({ message: "Failed to create notification" });
//     }
//   },
//   // Get all notifications for a user
//   async getUserNotifications(req: AuthenticatedRequest, res: Response) {
//     try {
//       const userId = req.user?.id;
//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       const notifications = await notificationService.getUserNotifications(
//         userId
//       );
//       res.status(200).json(notifications);
//     } catch (error) {
//       console.error("Error fetching user notifications:", error);
//       res.status(500).json({ message: "Failed to fetch notifications" });
//     }
//   },
//   // Mark a notification as read
//   async markNotificationAsRead(req: AuthenticatedRequest, res: Response) {
//     try {
//       const { notificationId } = req.params;
//       const userId = req.user?.id;
//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       const updatedNotification =
//         await notificationService.markNotificationAsRead(
//           notificationId,
//           userId
//         );
//       if (!updatedNotification) {
//         return res
//           .status(404)
//           .json({ message: "Notification not found or not authorized" });
//       }
//       res.status(200).json(updatedNotification);
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//       res.status(500).json({ message: "Failed to update notification" });
//     }
//   },
//   // Mark all notifications as read for a user
//   async markAllNotificationsAsRead(req: AuthenticatedRequest, res: Response) {
//     try {
//       const userId = req.user?.id;
//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       await notificationService.markAllNotificationsAsRead(userId);
//       res.status(200).json({ message: "All notifications marked as read" });
//     } catch (error) {
//       console.error("Error marking all notifications as read:", error);
//       res.status(500).json({ message: "Failed to update notifications" });
//     }
//   },
//   // Delete a notification
//   async deleteNotification(req: AuthenticatedRequest, res: Response) {
//     try {
//       const { notificationId } = req.params;
//       const userId = req.user?.id;
//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       const result = await notificationService.deleteNotification(
//         notificationId,
//         userId
//       );
//       if (!result) {
//         return res
//           .status(404)
//           .json({ message: "Notification not found or not authorized" });
//       }
//       res.status(200).json({ message: "Notification deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting notification:", error);
//       res.status(500).json({ message: "Failed to delete notification" });
//     }
//   },
//   // Get unread notification count for a user
//   async getUnreadNotificationCount(req: AuthenticatedRequest, res: Response) {
//     try {
//       const userId = req.user?.id;
//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       const count = await notificationService.getUnreadNotificationCount(
//         userId
//       );
//       res.status(200).json({ unreadCount: count });
//     } catch (error) {
//       console.error("Error fetching unread notification count:", error);
//       res
//         .status(500)
//         .json({ message: "Failed to fetch unread notification count" });
//     }
//   },
// };
// export default notificationController;
