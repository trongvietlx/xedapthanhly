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

async function sendAdminEmail(payload: Required<CheckoutPayload>, orderTime: string) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log(
      `[checkout] RESEND_API_KEY chưa được cấu hình. Đơn hàng mới: ${payload.name} - ${payload.phone} - ${payload.bikeName}`
    );
    return;
  }

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚲 Đơn Giữ Xe Mới: ${payload.name} - ${payload.bikeName}`,
      html: `
        <h2>Có đơn giữ xe mới!</h2>
        <p><strong>Khách hàng:</strong> ${payload.name}</p>
        <p><strong>Số điện thoại:</strong> ${payload.phone}</p>
        <p><strong>Xe đặt:</strong> ${payload.bikeName}</p>
        <p><strong>Giá:</strong> ${payload.bikePrice?.toLocaleString("vi-VN")} VNĐ</p>
        <p><strong>Thời gian:</strong> ${orderTime}</p>
        <p>Vui lòng gọi lại xác nhận cho khách trong vòng 15 phút.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
  }
}

// Điền Bot Token & Chat ID qua biến môi trường TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
// (xem hướng dẫn tạo bot & lấy chat id trong .env.example).
async function sendTelegramNotification(
  payload: Required<CheckoutPayload>,
  orderTime: string
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log(
      `[checkout] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID chưa được cấu hình, bỏ qua gửi Telegram.`
    );
    return;
  }

  const message = `🚲 <b>ĐƠN GIỮ XE MỚI!</b>
👤 Khách hàng: ${payload.name}
📞 SĐT: ${payload.phone}
🚴 Xe: ${payload.bikeName}
💰 Giá: ${payload.bikePrice?.toLocaleString("vi-VN")} VNĐ
🕐 Thời gian: ${orderTime}

⚡️ Vui lòng gọi lại xác nhận cho khách trong vòng 15 phút!`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Telegram API returned an error:", errorBody);
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}

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

  const notificationPayload: Required<CheckoutPayload> = {
    name,
    phone,
    bikeId,
    bikeName,
    bikePrice: bikePrice ?? 0,
  };

  await Promise.allSettled([
    sendAdminEmail(notificationPayload, orderTime),
    sendTelegramNotification(notificationPayload, orderTime),
  ]);

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
