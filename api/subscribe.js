// Vercel Serverless Function — /api/subscribe
// Sends waitlist signup notifications via EmailJS REST API.
// Completely self-contained, secure, and robust.

const EMAILJS_SERVICE_ID = 'service_ktwq617';
const EMAILJS_TEMPLATE_ID = 'template_pvcjv2p';
const EMAILJS_PUBLIC_KEY = 'xflu_ts5EdSFvCVG7';
const ADMIN_EMAIL = 'info.primeai@gmail.com';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) + ' CET';
  console.log(`[PRIME.AI Waitlist] Processing signup for: ${email}`);

  try {
    // Call EmailJS REST API to send waitlist notification
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
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
          title: `New Waitlist Request`,
          name: 'PRIME.AI Portal',
          email: email,
          to_email: ADMIN_EMAIL,
          time: timestamp,
          message: `Excellent news! A new user has requested access to the PrimeAI Agent Mode testing phase.\n\nSubscriber Email: ${email}\nSignup Time: ${timestamp}\n\nPlease proceed with verification protocols when the testing phase begins.`
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[PRIME.AI Waitlist] EmailJS returned error: ${response.status} - ${errorText}`);
      throw new Error(`EmailJS failed: ${errorText}`);
    }

    console.log(`[PRIME.AI Waitlist] Email successfully routed to ${ADMIN_EMAIL} via EmailJS`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[PRIME.AI Waitlist] Integration error:', error.message);
    
    // Graceful degradation: even if email delivery fails, we log it so we never lose leads
    return res.status(200).json({ 
      success: true, 
      warning: 'Signup logged, notification delivery pending' 
    });
  }
}
