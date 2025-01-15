import { CheckUserLogin } from '@/app/utils/checkUserLogin';
import prisma from '@/lib';
import { NextApiRequest, NextApiResponse } from 'next';

interface UserRequest extends NextApiRequest {
    user?: { id: number; name: string }; // User object from JWT
}

// Remove an item from the cart
export const removeCartItem = async (req: UserRequest, res: NextApiResponse) => {
    await CheckUserLogin(req, res, async () => {
        const { cartItemId } = req.query;

        try {
            await prisma.cartItem.delete({
                where: { id: Number(cartItemId) },
            });

            res.status(204)
        } catch (error) {
            res.status(500).json({ error: 'Failed to remove item from cart' });
        }
    });
};