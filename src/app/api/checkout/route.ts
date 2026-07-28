import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface CheckoutPayload {
  name: string;
  phone: string;
  bikeId: string;
  bikeName: string;
  bikePrice: number;
}

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "sale@xedapthanhly.vn";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<CheckoutPayload>;
  const { name, phone, bikeId, bikeName, bikePrice } = body;

  if (!name?.trim() || !phone?.trim() || !bikeId || !bikeName) {
    return NextResponse.json(
      { error: "Thiếu thông tin bắt buộc (tên, số điện thoại, xe)." },
      { status: 400 }
    );
  }

  const orderTime = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🚲 Đơn Giữ Xe Mới: ${name} - ${bikeName}`,
        html: `
          <h2>Có đơn giữ xe mới!</h2>
          <p><strong>Khách hàng:</strong> ${name}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          <p><strong>Xe đặt:</strong> ${bikeName}</p>
          <p><strong>Giá:</strong> ${bikePrice?.toLocaleString("vi-VN")} VNĐ</p>
          <p><strong>Thời gian:</strong> ${orderTime}</p>
          <p>Vui lòng gọi lại xác nhận cho khách trong vòng 15 phút.</p>
        `,
      });
    } catch (error) {
      console.error("Failed to send admin notification email:", error);
    }
  } else {
    console.log(
      `[checkout] RESEND_API_KEY chưa được cấu hình. Đơn hàng mới: ${name} - ${phone} - ${bikeName}`
    );
  }

  return NextResponse.json({
    success: true,
    message: "Đã ghi nhận đơn giữ xe.",
    order: {
      customerName: name,
      customerPhone: phone,
      bikeId,
      bikeName,
      bikePrice,
      createdAt: new Date().toISOString(),
    },
  });
}
