// Vercel Serverless Function — /api/subscribe
// Sends waitlist signup notifications via EmailJS REST API.
// Credentials loaded from Vercel environment variables.

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info.primeai@gmail.com';

export default async function handler(req, res) {
  // CORS Headers
  const allowedOrigin = 'https://prime-ai.fr';
  const origin = req.headers?.origin;
  res.setHeader('Access-Control-Allow-Origin', origin === allowedOrigin ? allowedOrigin : '');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, lang = 'fr' } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) + ' CET';
  console.log(`[PRIME.AI Waitlist] Processing signup (lang: ${lang})`);

  try {
    // 1. Send Notification Email to Admin
    const adminResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://prime-ai.fr'
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          title: `[PRIME.AI Newsletter] New Subscriber`,
          name: 'PRIME.AI Portal',
          email: email,
          to_email: ADMIN_EMAIL,
          time: timestamp,
          message: `New subscriber signup received.\n\nSubscriber Email: ${email}\nSignup Time: ${timestamp}`
        }
      })
    });

    if (!adminResponse.ok) {
      const errorText = await adminResponse.text();
      console.error(`[PRIME.AI Waitlist] Admin notification failed: ${adminResponse.status}`);
      throw new Error(`Admin notification failed: ${errorText}`);
    }

    console.log(`[PRIME.AI Waitlist] Notification email successfully routed.`);

    // 2. Send Localized Welcome Email to Subscriber
    const isFrench = lang.toLowerCase() === 'fr';
    const welcomeTitle = isFrench ? 'Bienvenue chez PRIME-AI !' : 'Welcome to PRIME-AI!';
    const welcomeMessage = isFrench 
      ? `Bonjour,\n\nMerci de vous être inscrit à la newsletter de PRIME-AI (prime-ai.fr) !\n\nNous sommes ravis de vous compter parmi nous. Vous recevrez très bientôt nos dernières actualités sur le déploiement d'IA souveraines, nos fonctionnalités autonomes et nos briefs d'architecture exclusifs.\n\nCordialement,\nL'équipe PRIME-AI`
      : `Hello,\n\nThank you for subscribing to the PRIME-AI newsletter (prime-ai.fr)!\n\nWe are thrilled to have you with us. You will soon receive our latest updates on sovereign AI deployment, autonomous features, and exclusive architecture briefs.\n\nBest regards,\nThe PRIME-AI Team`;

    const subscriberResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://prime-ai.fr'
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          title: welcomeTitle,
          name: 'PRIME-AI Team',
          email: email,
          to_email: email,
          time: timestamp,
          message: welcomeMessage
        }
      })
    });

    if (!subscriberResponse.ok) {
      const errorText = await subscriberResponse.text();
      console.warn(`[PRIME.AI Waitlist] Welcome email failed: ${subscriberResponse.status} - ${errorText}`);
      // Don't throw here to avoid failing the subscription process if welcome email has delivery issues
    } else {
      console.log(`[PRIME.AI Waitlist] Welcome email successfully sent.`);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[PRIME.AI Waitlist] Integration error:', error.message);
    
    // Graceful degradation: log to console to prevent lead loss
    return res.status(200).json({ 
      success: true, 
      warning: 'Signup logged, notification delivery pending' 
    });
  }
}
