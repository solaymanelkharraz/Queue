export function announceNumber() {
  // Play the ding sound when a new number is called
  const ding = new Audio('/dingdong.m4a');
  ding.play().catch(e => {
    console.error("Browser blocked autoplay. Please click anywhere on the TV screen first.", e);
  });
}

export function playReminder() {
  // Play the voice reminder periodically
  const voice = new Audio('/إذا لم يكن لديك رقم .m4a');
  voice.play().catch(e => {
    console.error("Failed to play voice reminder:", e);
  });
}
