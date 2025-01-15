import { CheckUserLogin } from '@/app/utils/checkUserLogin';
import prisma from '@/lib';
import { NextApiRequest, NextApiResponse } from 'next';

interface UserRequest extends NextApiRequest {
    user?: { id: number; name: string }; // User object from JWT
}
// Update cart item
export const updateCartItem = async (req: UserRequest, res: NextApiResponse) => {
    await CheckUserLogin(req, res, async () => {
        const { cartItemId } = req.query;
        const { quantity, price } = req.body;

        try {
            const updatedCartItem = await prisma.cartItem.update({
                where: { id: Number(cartItemId) },
                data: {
                    quantity: quantity,
                    subtotal: price * quantity,
                },
            });

            res.status(200).json(updatedCartItem);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update cart item' });
        }
    });
};