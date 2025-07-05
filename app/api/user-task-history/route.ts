import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const {
            uid,
            userName,
            serviceName,
            fromDate,
            toDate,
            uploadedFileName,
            responseMessage,
            transactionType,
            responseStatus,
        } = data;

        const toDateObj = (str: string) => {
            const date = new Date(`${str}T00:00:00Z`);
            if (isNaN(date.getTime())) throw new Error(`Invalid date: ${str}`);
            return date;
        };
        
        // LIVE SERVER WORKING FUNCTION
        // function getISTDate(): Date {
        //     // Method 1: If server is in IST
        //     return new Date();

        //     // // Method 2: Force IST conversion
        //     // return new Date(Date.now() + (5.5 * 60 * 60 * 1000));
        // }

        function getISTDate() {
            return new Date();
        }

        const newRecord = await prisma.user_task_history.create({
            data: {
                uid,
                UserName: userName,
                ServiceName: serviceName,
                FromDate: toDateObj(fromDate),
                ToDate: toDateObj(toDate),
                UploadedFileName: uploadedFileName,
                ResponseMessage: responseMessage,
                TransactionType: transactionType ? parseInt(transactionType) : null,
                ResponseStatus: responseStatus,
                createdAt: getISTDate(),
            },
        });


        return NextResponse.json({ success: true, data: newRecord });

    } catch (error) {
        console.error("Failed to save task history", error);
        return NextResponse.json({ success: false, error: "DB Save Failed" }, { status: 500 });
    }
}
