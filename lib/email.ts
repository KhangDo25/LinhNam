import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_USER || !SMTP_PASS) {
  console.warn('⚠️ Chưa cấu hình SMTP_USER và SMTP_PASS trong .env');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  code: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Kiểm tra cấu hình trước khi gửi
    if (!SMTP_USER || !SMTP_PASS) {
      return {
        success: false,
        error: 'Chưa cấu hình email. Vui lòng kiểm tra .env',
      };
    }

    const info = await transporter.sendMail({
      from: `"LinhNam" <${SMTP_USER}>`,
      to: email,
      subject: '🔐 Xác thực tài khoản LinhNam',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #e0d5c1; padding: 40px; border-radius: 12px; border: 1px solid #c9a84c30;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c9a84c; font-size: 32px; margin: 0;">🐉 LinhNam</h1>
            <p style="color: #c9a84c80; font-size: 14px; margin: 0;">Huyền sử Việt</p>
          </div>

          <!-- Content -->
          <div style="background: #14142a; padding: 30px; border-radius: 8px;">
            <h2 style="color: #e0d5c1; font-size: 22px; margin-top: 0;">Xin chào ${name}! 👋</h2>
            <p style="color: #a09888; font-size: 16px; line-height: 1.6;">
              Cảm ơn bạn đã đăng ký tài khoản tại <strong style="color: #c9a84c;">LinhNam</strong>.
            </p>
            <p style="color: #a09888; font-size: 16px; line-height: 1.6;">
              Mã xác thực của bạn là:
            </p>

            <!-- Code Box -->
            <div style="background: #0a0a1a; padding: 20px; text-align: center; border: 2px dashed #c9a84c; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 36px; letter-spacing: 12px; color: #c9a84c; font-weight: bold;">
                ${code}
              </span>
            </div>

            <p style="color: #a09888; font-size: 14px; line-height: 1.6;">
              ⏰ Mã có hiệu lực trong <strong style="color: #c9a84c;">15 phút</strong>.
            </p>
            <p style="color: #6a6258; font-size: 13px; line-height: 1.6; margin-top: 20px;">
              Nếu bạn không đăng ký, vui lòng bỏ qua email này.
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #c9a84c20;">
            <p style="color: #6a6258; font-size: 12px;">
              © 2026 LinhNam - Nền tảng văn hóa và thần thoại Việt Nam
            </p>
          </div>
        </div>
      `,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể gửi email',
    };
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderId: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!SMTP_USER || !SMTP_PASS) {
      return {
        success: false,
        error: 'Chưa cấu hình email. Vui lòng kiểm tra .env',
      };
    }

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #c9a84c20;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #c9a84c20; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #c9a84c20; text-align: right;">${item.price.toLocaleString()} LT</td>
        </tr>
      `
      )
      .join('');

    await transporter.sendMail({
      from: `"LinhNam" <${SMTP_USER}>`,
      to: email,
      subject: '✅ Xác nhận đơn hàng LinhNam',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #e0d5c1; padding: 40px; border-radius: 12px; border: 1px solid #c9a84c30;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c9a84c; font-size: 32px; margin: 0;">🐉 LinhNam</h1>
            <p style="color: #c9a84c80; font-size: 14px; margin: 0;">Huyền sử Việt</p>
          </div>

          <div style="background: #14142a; padding: 30px; border-radius: 8px;">
            <h2 style="color: #e0d5c1; font-size: 22px; margin-top: 0;">Xin chào ${name}! 🎉</h2>
            <p style="color: #a09888; font-size: 16px; line-height: 1.6;">
              Cảm ơn bạn đã mua sắm tại <strong style="color: #c9a84c;">LinhNam</strong>.
            </p>
            <p style="color: #a09888; font-size: 16px; line-height: 1.6;">
              Đơn hàng <strong style="color: #c9a84c;">#${orderId.slice(0, 8).toUpperCase()}</strong> đã được xác nhận.
            </p>

            <div style="background: #0a0a1a; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="color: #c9a84c; border-bottom: 2px solid #c9a84c30;">
                    <th style="text-align: left; padding: 8px;">Sản phẩm</th>
                    <th style="text-align: center; padding: 8px;">SL</th>
                    <th style="text-align: right; padding: 8px;">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="border-top: 2px solid #c9a84c30;">
                    <td colspan="2" style="padding: 12px; text-align: right; color: #c9a84c; font-weight: bold;">Tổng cộng:</td>
                    <td style="padding: 12px; text-align: right; color: #c9a84c; font-weight: bold; font-size: 18px;">
                      ${total.toLocaleString()} LT
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p style="color: #a09888; font-size: 14px; line-height: 1.6;">
              Bạn có thể xem chi tiết đơn hàng trong <a href="${process.env.NEXTAUTH_URL}/tai-khoan" style="color: #c9a84c;">tài khoản</a> của mình.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #c9a84c20;">
            <p style="color: #6a6258; font-size: 12px;">
              © 2026 LinhNam - Nền tảng văn hóa và thần thoại Việt Nam
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể gửi email',
    };
  }
}