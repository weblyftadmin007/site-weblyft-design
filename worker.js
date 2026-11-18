export default {
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.weblyftgo.online") {
      url.hostname = "weblyftgo.online";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
