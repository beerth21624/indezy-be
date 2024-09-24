"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { notificationController } from "../controllers/notificationController";
const router = express_1.default.Router();
// router.post(
//   "/notifications",
//   notificationController.createNotification
// );
// router.get(
//   "/notifications",
//   notificationController.getUserNotifications
// );
// router.patch(
//   "/notifications/:notificationId/read",
//   notificationController.markNotificationAsRead
// );
// router.patch(
//   "/notifications/read-all",
//   notificationController.markAllNotificationsAsRead
// );
// router.delete(
//   "/notifications/:notificationId",
//   notificationController.deleteNotification
// );
// router.get(
//   "/notifications/unread-count",
//   notificationController.getUnreadNotificationCount
// );
exports.default = router;
