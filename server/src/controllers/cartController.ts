import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";
import { sendResponse, sendError } from "../utils/response";

export const addToCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, "Unauthenticated user");
      return;
    }

    const { productId, quantity, size, color } = req.body;

    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size: size || null,
          color: color || null,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
        size,
        color,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true,
        price: true,
        images: true,
      },
    });

    const responseItem = {
      id: cartItem.id,
      productId: cartItem.productId,
      name: product?.name,
      price: product?.price,
      image: product?.images[0],
      color: cartItem.color,
      size: cartItem.size,
      quantity: cartItem.quantity,
    };

    sendResponse(res, 201, true, "Item added to cart", responseItem);
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Some error occurred!");
  }
};

export const getCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, "Unauthenticated user");
      return;
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      sendResponse(res, 200, true, "Cart is empty", []);
      return;
    }

    const cartItemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            images: true,
          },
        });

        return {
          id: item.id,
          productId: item.productId,
          name: product?.name,
          price: product?.price,
          image: product?.images[0],
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        };
      })
    );

    sendResponse(res, 200, true, "Cart fetched successfully", cartItemsWithProducts);
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to fetch cart!");
  }
};

export const removeFromCart = async (
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

    await prisma.cartItem.delete({
      where: {
        id,
        cart: { userId },
      },
    });

    sendResponse(res, 200, true, "Item removed from cart");
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to remove from cart!");
  }
};

export const updateCartItemQuantity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      sendError(res, 401, "Unauthenticated user");
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id,
        cart: { userId },
      },
      data: { quantity },
    });

    const product = await prisma.product.findUnique({
      where: { id: updatedItem.productId },
      select: {
        name: true,
        price: true,
        images: true,
      },
    });

    const responseItem = {
      id: updatedItem.id,
      productId: updatedItem.productId,
      name: product?.name,
      price: product?.price,
      image: product?.images[0],
      color: updatedItem.color,
      size: updatedItem.size,
      quantity: updatedItem.quantity,
    };

    sendResponse(res, 200, true, "Quantity updated successfully", responseItem);
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to update cart item quantity");
  }
};

export const clearEntireCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, "Unauthenticated user");
      return;
    }

    await prisma.cartItem.deleteMany({
      where: {
        cart: { userId },
      },
    });

    sendResponse(res, 200, true, "Cart cleared successfully!");
  } catch (e) {
    console.error(e);
    sendError(res, 500, "Failed to clear cart!");
  }
};
