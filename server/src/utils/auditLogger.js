// backend/src/utils/auditLogger.js
import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async ({
  req,
  action,
  targetUserId = null,
  details = {},
}) => {
  try {
    await AuditLog.create({
      adminId: req.user?._id,
      action,
      targetUserId,
      details,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};