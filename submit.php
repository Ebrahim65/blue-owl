<?php
/* ============================================================
   Jobidy Waitlist — Form Handler
   BlueOwl © 2026
============================================================ */

header('Content-Type: application/json');

/* Only accept POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit;
}

/* Validate email */
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

$from         = 'Jobidy by BlueOwl <jobidy@blueowl.co.za>';
$reply_to     = 'jobidy@blueowl.co.za';
$notify_email = 'jobidy@blueowl.co.za';

/* ── 1. Notify the team ───────────────────────────────────── */
$notify_subject = 'New Jobidy Waitlist Signup';
$notify_body    = "New waitlist signup\n\nEmail: {$email}\nDate:  " . date('Y-m-d H:i:s') . " UTC";
$notify_headers = "From: {$from}\r\nReply-To: {$email}\r\nContent-Type: text/plain; charset=UTF-8";

mail($notify_email, $notify_subject, $notify_body, $notify_headers);

/* ── 2. Confirmation email to the user ───────────────────── */
$user_subject = "You're on the Jobidy waitlist!";

$user_headers = implode("\r\n", [
    "From: {$from}",
    "Reply-To: {$reply_to}",
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "X-Mailer: PHP/" . phpversion(),
]);

$user_body = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#030712;font-family:'Segoe UI',Arial,sans-serif;color:#F1F5F9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#030712;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px 36px;">

        <!-- Brand -->
        <tr><td align="center" style="padding-bottom:28px;">
          <span style="font-size:1rem;font-weight:700;color:#F1F5F9;">Blue<span style="color:#3B82F6;">Owl</span></span>
        </td></tr>

        <!-- Headline -->
        <tr><td align="center" style="padding-bottom:16px;">
          <h1 style="margin:0;font-size:1.9rem;font-weight:900;letter-spacing:-0.03em;color:#F1F5F9;">
            You're on the list! 🎉
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="color:#94A3B8;font-size:0.95rem;line-height:1.75;padding-bottom:28px;text-align:center;">
          <p style="margin:0 0 14px;">
            Thanks for signing up for early access to <strong style="color:#F1F5F9;">Jobidy</strong> —
            our upcoming platform that connects you with skilled professionals to get any task done.
          </p>
          <p style="margin:0;">
            We're working hard to bring it to life. You'll be among the
            <strong style="color:#F1F5F9;">first to know</strong> when we launch,
            and may receive early access perks.
          </p>
        </td></tr>

        <!-- What's coming -->
        <tr><td style="border-top:1px solid rgba(255,255,255,0.08);padding:24px 0 0;">
          <p style="margin:0 0 16px;text-align:center;color:#94A3B8;font-size:0.85rem;">
            What's coming with Jobidy:
          </p>
          <table width="100%">
            <tr>
              <td style="text-align:center;padding:8px 4px;">
                <div style="font-size:1.5rem;">🔧</div>
                <div style="font-size:0.75rem;color:#64748B;margin-top:5px;">Any skill</div>
              </td>
              <td style="text-align:center;padding:8px 4px;">
                <div style="font-size:1.5rem;">📍</div>
                <div style="font-size:0.75rem;color:#64748B;margin-top:5px;">Near you</div>
              </td>
              <td style="text-align:center;padding:8px 4px;">
                <div style="font-size:1.5rem;">✅</div>
                <div style="font-size:0.75rem;color:#64748B;margin-top:5px;">Verified pros</div>
              </td>
              <td style="text-align:center;padding:8px 4px;">
                <div style="font-size:1.5rem;">🔒</div>
                <div style="font-size:0.75rem;color:#64748B;margin-top:5px;">Secure payments</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding-top:28px;border-top:1px solid rgba(255,255,255,0.06);margin-top:24px;">
          <p style="margin:0;font-size:0.73rem;color:#475569;line-height:1.6;">
            You received this because you signed up at <strong style="color:#64748B;">blueowl.co.za</strong><br>
            No spam — we'll only email you when it matters.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;

$sent = mail($email, $user_subject, $user_body, $user_headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not send email.']);
}
