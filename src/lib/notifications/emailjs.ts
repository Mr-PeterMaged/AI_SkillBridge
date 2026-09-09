import "server-only";

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

function getEmailJsConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim();
  const templateId = process.env.EMAILJS_PAYMENT_TEMPLATE_ID?.trim();
  const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  if (!serviceId || !templateId || !publicKey || !privateKey) return null;
  return { serviceId, templateId, publicKey, privateKey };
}

/**
 * Best-effort notification email via EmailJS. Never throws: a missing
 * config or a delivery failure must not block payment-request creation.
 *
 * Recipient ("To Email") is fixed in the EmailJS template settings, not
 * passed from here. template_params fill in {{name}}, {{email}}, {{title}},
 * {{time}} used by the template header/subject, plus the per-field merge
 * tags ({{full_name}}, {{phone}}, {{plan_name}}, {{promo_code}}, ...) used
 * by the custom fields table in the template body.
 */
export async function sendPaymentRequestNotification(params: {
  reference: string;
  fullName: string;
  phone: string;
  userEmail: string;
  planName: string;
  finalAmountLabel: string;
  promoCode: string;
  whatsappUrl: string;
}) {
  const config = getEmailJsConfig();
  if (!config) {
    console.warn("[emailjs] Skipping payment notification: EmailJS is not configured.");
    return;
  }

  try {
    const res = await fetch(EMAILJS_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        accessToken: config.privateKey,
        template_params: {
          name: params.fullName,
          email: params.userEmail,
          title: `${params.planName} — ${params.reference}`,
          time: new Date().toLocaleString("en-GB", { timeZone: "Africa/Cairo" }),
          full_name: params.fullName,
          phone: params.phone,
          user_email: params.userEmail,
          plan_name: params.planName,
          final_amount: params.finalAmountLabel,
          promo_code: params.promoCode,
          reference: params.reference,
          whatsapp_url: params.whatsappUrl,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[emailjs] Payment notification failed (${res.status}): ${body}`);
    }
  } catch (error) {
    console.error("[emailjs] Payment notification request errored:", error);
  }
}
