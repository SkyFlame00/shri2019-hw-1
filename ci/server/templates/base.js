const styles = `
.Build-Indicator_type_built::before,
.Build-Indicator_type_building::before,
.Build-Indicator_type_queued::before,
.Build-Indicator_type_error::before {
  display: inline-block;
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.Build-Indicator_type_built::before {
  background: green;
}

.Build-Indicator_type_building::before,
.Build-Indicator_type_queued::before {
  background: yellow;
}

.Build-Indicator_type_error::before {
  background: red;
}

pre {
  white-space: pre-wrap;
}
`;

module.exports = body => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Simple CI</title>
        <meta charset="utf-8">
        <style>${styles}</style>
      </head>

      <body>
        ${Array.isArray(body) ? body.join('') : body}
      </body>
    </html>
  `.trim();
}