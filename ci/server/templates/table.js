const { port } = require('../config');

module.exports = builds => {
  return `
    <table class="Table">
      <thead class="Table-Head>
        <tr class="Table-HeadRow">
          <th class="Table-HeadCell">Build id</th>
          <th class="Table-HeadCell">Commit hash</th>
          <th class="Table-HeadCell">Build command</th>
          <th class="Table-HeadCell">Status</th>
        </tr>
      </thead>

      <tbody>
        ${builds.map(({buildId, buildCommand, commitHash, status}) => {
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
          }

          return `
            <tr class="Table-BodyRow">
              <td class="Table-BodyCell"><a href="http://localhost:${port}/build/${buildId}">${buildId}</td>
              <td class="Table-BodyCell">${commitHash}</td>
              <td class="Table-BodyCell">${buildCommand}</td>
              <td class="Table-BodyCell">
                <span class="${cssClass}"></span>
                <span class="Builds-StatusText">${statusText}</span>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}