import prisma from "@repo/db/client";
import { Request, Response } from "express";
import { CustomRequest } from "../types/share";
const createOnRampTransaction = async (req: CustomRequest, res: Response) => {
    const token = (Math.random() * 1000).toString()
    const amount = 100
    await prisma.onRampTransaction.create({
        data: {
            provider: "axisBank",
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: req.user,
            amount: amount * 100
        }
    })
    return res.send({
        message: "success"
    })
}

const p2pTransfer = async () => {
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }
    await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
        });
        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
        }

        await tx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
        });

        await tx.balance.update({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
        });
        await tx.p2pTransfer.create({
            data: {
                fromUserId: from,
                toUserId: toUser.id,
                amount,
                timestamp: new Date()
            }
        })
    });
}