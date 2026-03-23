import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs/promises";
import { sendResponse, sendError } from "../utils/response";

export const addFeatureBanners = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      sendError(res, 404, "No files provided");
      return;
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce-feature-banners",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const banners = await Promise.all(
      uploadResults.map((result) =>
        prisma.featureBanner.create({
          data: {
            imageUrl: result.secure_url,
          },
        })
      )
    );

    //clean the uploaded files asynchronously with error handling
    await Promise.all(
      files.map(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (e) {
          console.error(`Failed to delete local file: ${file.path}`, e);
        }
      })
    );
    
    sendResponse(res, 201, true, "Feature banners added successfully", banners);
  } catch (e: any) {
    console.error("Banner Upload Error:", e);
    // Even on error, try to clean up files
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          try {
            await fs.unlink(file.path);
          } catch (err) {}
        })
      );
    }
    sendError(res, 500, `Failed to add feature banners: ${e.message || "Unknown error"}`);
  }
};

export const fetchFeatureBanners = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const banners = await prisma.featureBanner.findMany({
      orderBy: { createdAt: "desc" },
    });
    sendResponse(res, 200, true, "Banners fetched successfully", banners);
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to fetch feature banners");
  }
};

export const updateFeaturedProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length > 8) {
      sendError(res, 400, "Invalid product IDs or too many requests");
      return;
    }

    await prisma.product.updateMany({
      data: { isFeatured: false },
    });

    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { isFeatured: true },
    });

    sendResponse(res, 200, true, "Featured products updated successfully!");
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to update featured products");
  }
};

export const getFeaturedProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
    });

    sendResponse(res, 200, true, "Featured products fetched successfully", featuredProducts);
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to fetch featured products");
  }
};
