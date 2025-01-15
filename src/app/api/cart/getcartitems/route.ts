import { CheckUserLogin } from '@/app/utils/checkUserLogin';
import prisma from '@/lib';
import { NextApiRequest, NextApiResponse } from 'next';

interface UserRequest extends NextApiRequest {
    user?: { id: number; name: string }; // User object from JWT
}
// Get cart items
export const getCartItems = async (req: UserRequest, res: NextApiResponse) => {
    await CheckUserLogin(req, res, async () => {
        try {
            const cartItems = await prisma.cartItem.findMany({
                where: {
                    cart: {
                        userId: req.user?.id,
                    },
                },
                include: {
                    product: true,
                },
            });

            res.status(200).json(cartItems);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve cart items' });
        }
    });
};