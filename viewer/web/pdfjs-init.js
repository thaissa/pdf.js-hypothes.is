'use strict';

// Script that loads the Hypothesis client after PDF.js is initialized.
// After making changes to this file, copy it to viewer/web/pdfjs-init.js.

// Listen for `webviewerloaded` event to configure the viewer after its files
// have been loaded but before it is initialized.
//
// PDF.js >= v2.10.377 fires this event at the parent document if it is embedded
// in a same-origin iframe. See https://github.com/mozilla/pdf.js/pull/11837.
try {
  parent.document.addEventListener('webviewerloaded', onViewerLoaded);
} catch (err) {
  // Parent document is cross-origin. The event will be fired at the current
  // document instead.
  document.addEventListener('webviewerloaded', onViewerLoaded);
}

function onViewerLoaded() {
  PDFViewerApplication.initializedPromise.then(() => {
    const embedScript = document.createElement('script');
    embedScript.src = 'https://h.npcourses.com/embed.js';
    document.body.appendChild(embedScript);
  });

  const hypothesis_access_token = localStorage.getItem('hypothesis_access_token');

  window.hypothesisConfig = function () {
    return {
      mainContainerSelector: document.getElementById('outerContainer'),
      services: [{
        apiUrl          : 'https://h.npcourses.com/api/',
        authority       : 'bastreamingstg.wpengine.com',
        grantToken      : hypothesis_access_token,
        enableShareLinks: false,
        onLoginRequest  : function(){
          document.location.href = '/login?redirect_to=' + encodeURIComponent(window.location.href);
        },
        onLogoutRequest: function (){
          document.location.href = '/account/logout';
        },
        onSignupRequest: function() {
          document.location.href = '/register?redirect_to=' + encodeURIComponent(window.location.href);
        },
        onProfileRequest: function() {
          document.location.href = '/account';
        },
        usernameUrl: function() {
          return false;
        }
      }]
    };
  };
}