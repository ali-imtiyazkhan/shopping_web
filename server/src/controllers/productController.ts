import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs/promises";
import { Prisma } from "@prisma/client";
import { sendResponse, sendError } from "../utils/response";

//create a product
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  try {
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
    } = req.body;

    if (!files || files.length === 0) {
      sendError(res, 400, "Please upload at least one image");
      return;
    }

    //upload all images to cloudinary
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce",
      })
    );

    const uploadresults = await Promise.all(uploadPromises);
    const imageUrls = uploadresults.map((result) => result.secure_url);

    const newlyCreatedProduct = await prisma.product.create({
      data: {
        name,
        brand,
        category,
        description,
        gender,
        sizes: sizes ? sizes.split(",") : [],
        colors: colors ? colors.split(",") : [],
        price: parseFloat(price),
        stock: parseInt(stock),
        images: imageUrls,
        soldCount: 0,
        rating: 0,
      },
    });

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
    
    sendResponse(res, 201, true, "Product created successfully", newlyCreatedProduct);
  } catch (e) {
    console.error(e);
    // Even on error, try to clean up files
    if (files && files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          try {
            await fs.unlink(file.path);
          } catch (err) {}
        })
      );
    }
    sendError(res, 500, "Failed to create product");
  }
};

//fetch all products (admin side)
export const fetchAllProductsForAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    sendResponse(res, 200, true, "Products fetched successfully", products);
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to fetch products");
  }
};

//get a single product
export const getProductByID = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      sendError(res, 404, "Product not found");
      return;
    }

    sendResponse(res, 200, true, "Product fetched successfully", product);
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to fetch product");
  }
};

//update a product (admin)
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
      rating,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      if (files && files.length > 0) {
        await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => {})));
      }
      sendError(res, 404, "Product not found");
      return;
    }

    let imageUrls = existingProduct.images;

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "ecommerce",
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      const newImageUrls = uploadResults.map((result) => result.secure_url);
      imageUrls = [...imageUrls, ...newImageUrls];

      // Clean up local files
      await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => {})));
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        brand,
        category,
        description,
        gender,
        sizes: sizes ? sizes.split(",") : undefined,
        colors: colors ? colors.split(",") : undefined,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        rating: rating ? parseInt(rating) : undefined,
        images: imageUrls,
      },
    });

    sendResponse(res, 200, true, "Product updated successfully", updatedProduct);
  } catch (e) {
    console.error(e);
    if (files && files.length > 0) {
      await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => {})));
    }
    sendError(res, 500, "Failed to update product");
  }
};

//delete a product (admin)
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
       sendError(res, 404, "Product not found");
       return;
    }

    await prisma.product.delete({ where: { id } });
    sendResponse(res, 200, true, "Product deleted successfully");
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to delete product");
  }
};

//fetch products with filter (client)
export const getProductsForClient = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const categories = ((req.query.categories as string) || "")
      .split(",")
      .filter(Boolean);
    const brands = ((req.query.brands as string) || "")
      .split(",")
      .filter(Boolean);
    const sizes = ((req.query.sizes as string) || "")
      .split(",")
      .filter(Boolean);
    const colors = ((req.query.colors as string) || "")
      .split(",")
      .filter(Boolean);

    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice =
      parseFloat(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const skip = (page - 1) * limit;

    const where: Prisma.productWhereInput = {
      AND: [
        categories.length > 0
          ? {
              category: {
                in: categories,
                mode: "insensitive",
              },
            }
          : {},
        brands.length > 0
          ? {
              brand: {
                in: brands,
                mode: "insensitive",
              },
            }
          : {},
        sizes.length > 0
          ? {
              sizes: {
                hasSome: sizes,
              },
            }
          : {},
        colors.length > 0
          ? {
              colors: {
                hasSome: colors,
              },
            }
          : {},
        {
          price: { gte: minPrice, lte: maxPrice },
        },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.product.count({ where }),
    ]);

    sendResponse(res, 200, true, "Products fetched successfully", {
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to fetch products");
  }
};
