import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";
import { sendResponse, sendError } from "../utils/response";

export const createAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, "Unauthenticated user");
      return;
    }

    const { name, address, city, country, postalCode, phone, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newlyCreatedAddress = await prisma.address.create({
      data: {
        userId,
        name,
        address,
        city,
        country,
        postalCode,
        phone,
        isDefault: isDefault || false,
      },
    });

    sendResponse(res, 201, true, "Address created successfully", { address: newlyCreatedAddress });
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Some error occurred");
  }
};

export const getAddresses = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, "Unauthenticated user");
      return;
    }

    const fetchAllAddresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    sendResponse(res, 200, true, "Addresses fetched successfully", { address: fetchAllAddresses });
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Some error occurred");
  }
};

export const updateAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      sendError(res, 401, "Unauthenticated user");
      return;
    }

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      sendError(res, 404, "Address not found!");
      return;
    }

    const { name, address, city, country, postalCode, phone, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        name,
        address,
        city,
        country,
        postalCode,
        phone,
        isDefault: isDefault || false,
      },
    });

    sendResponse(res, 200, true, "Address updated successfully", { address: updatedAddress });
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Some error occurred");
  }
};

export const deleteAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, "Unauthenticated user");
      return;
    }

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      sendError(res, 404, "Address not found!");
      return;
    }

    await prisma.address.delete({
      where: { id },
    });

    sendResponse(res, 200, true, "Address deleted successfully!");
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Some error occurred");
  }
};
