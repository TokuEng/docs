(function () {
  var protectedTargets = {
    "/api/protected-links/create-api-token": "/api/endpoints/authentication/create-api-token",
    "/api/protected-links/refresh-api-token": "/api/endpoints/authentication/refresh-api-token",
    "/api/protected-links/generate-auth-nonce": "/api/endpoints/authentication/generate-auth-nonce",
    "/integration-guide/protected-links/create-api-token": "/integration-guide/endpoints/auth/create-api-token",
    "/integration-guide/protected-links/refresh-api-token": "/integration-guide/endpoints/auth/refresh-api-token",
    "/integration-guide/protected-links/generate-auth-nonce": "/integration-guide/endpoints/auth/generate-auth-nonce",
    "/integrations/protected-links/adp": "/integrations/adp",
    "/integrations/protected-links/adp-token-deduction": "/integrations/adp-token-deduction",
    "/integrations/protected-links/adp-export-employees": "/integrations/adp-export-employees",
    "/integrations/protected-links/workday": "/integrations/workday",
    "/integrations/protected-links/ukg": "/integrations/ukg",
  };

  function normalizePath(pathname) {
    var normalized = pathname.replace(/\/+$/, "");
    return normalized || "/";
  }

  function hasLogoutLink() {
    if (document.querySelector("logout-link")) {
      return true;
    }

    var authLinks = document.querySelectorAll("a, button, logout-link");
    for (var i = 0; i < authLinks.length; i += 1) {
      if (/^\s*log\s*out\s*$/i.test(authLinks[i].textContent || "")) {
        return true;
      }
    }

    return false;
  }

  function rewriteProtectedPlaceholderLinks() {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];
      var linkUrl;

      try {
        linkUrl = new URL(link.href, window.location.origin);
      } catch (error) {
        continue;
      }

      var target = protectedTargets[normalizePath(linkUrl.pathname)];
      if (target) {
        link.href = target;
      }
    }
  }

  function redirectFromPlaceholder() {
    var currentPath = normalizePath(window.location.pathname);
    var target = protectedTargets[currentPath];
    if (target) {
      window.location.replace(target);
      return true;
    }

    return false;
  }

  function applyAuthenticatedRouting() {
    if (!hasLogoutLink()) {
      return false;
    }

    rewriteProtectedPlaceholderLinks();
    return redirectFromPlaceholder();
  }

  if (applyAuthenticatedRouting()) {
    return;
  }

  var attempts = 0;
  var interval = window.setInterval(function () {
    attempts += 1;
    if (applyAuthenticatedRouting() || attempts >= 40) {
      window.clearInterval(interval);
    }
  }, 125);

  var observer = new MutationObserver(function () {
    if (applyAuthenticatedRouting()) {
      observer.disconnect();
      window.clearInterval(interval);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
