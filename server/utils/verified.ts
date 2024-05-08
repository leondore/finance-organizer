export default defineEventHandler((event) => {
  if (!event.context.user?.emailVerified) {
    throw EmailVerificationError();
  }
});
