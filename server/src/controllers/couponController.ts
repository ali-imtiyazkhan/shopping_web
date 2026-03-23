import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";
import { sendResponse, sendError } from "../utils/response";

export const createCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { code, discountPercent, startDate, endDate, usageLimit } = req.body;

    const newlyCreatedCoupon = await prisma.coupon.create({
      data: {
        code,
        discountPercent: parseInt(discountPercent),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: parseInt(usageLimit),
        usageCount: 0,
      },
    });

    sendResponse(res, 201, true, "Coupon created successfully!", { coupon: newlyCreatedCoupon });
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to create coupon");
  }
};

export const fetchAllCoupons = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const fetchAllCouponsList = await prisma.coupon.findMany({
      orderBy: { createdAt: "asc" },
    });
    sendResponse(res, 200, true, "Coupons fetched successfully!", { couponList: fetchAllCouponsList });
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to fetch coupon list");
  }
};

export const deleteCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.coupon.delete({
      where: { id },
    });

    sendResponse(res, 200, true, "Coupon deleted successfully!", { id });
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to delete coupon");
  }
};
