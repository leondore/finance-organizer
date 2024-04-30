export default defineEventHandler(async (event) => {
  if (!isAdmin(event.context)) {
    throw UnauthorizedError();
  }
});
