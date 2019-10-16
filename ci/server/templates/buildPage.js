const { port: serverPort } = require('../config');

module.exports = ({
  status, buildId, buildCommand, commitHash, content, hostname, port, startDate, endDate
}) => {
  let cssClass, statusText;

  switch(status) {
    case 'built':
      cssClass = 'Build-Indicator_type_built';
      statusText = 'Built';
      break;
    case 'building':
      cssClass = 'Build-Indicator_type_building';
      statusText = 'Being built';
      break;
    case 'queued':
      cssClass = 'Build-Indicator_type_queued';
      statusText = 'In queue';
      break;
    case 'error':
      cssClass = 'Build-Indicator_type_error';
      statusText = 'Error';
      break;
  }

  return `
    <div class="BuildPage">
      <div class="BuildPage-LinkToHome"><a href="http://localhost:${serverPort}/">< Back to Home</a></div>
      <div>Build ID: ${buildId}</div>
      ${commitHash && `<div>Commit hash: ${commitHash}</div>`}
      ${buildCommand && `<div>Build command: ${buildCommand}</div>`}
      ${ (hostname && port &&
        `<div>Agent: ${hostname}:${port}</div>`) || ''
      }
      ${ (startDate && endDate &&
        `
        <div>Started at: ${startDate}</div>
        <div>Ended at: ${endDate}</div>
        `) || ''
      }
      <div class="BuildPage-Status">Status: <span class="${cssClass}"></span>${statusText}</div>

      <div class="BuildPage-Content">
        <div class="BuildPage-ContentHeader">Output:</div>
        <div class="BuildPage-ContentContent"><pre>${content}</pre></div>
      </div>
    </div>
  `;
}