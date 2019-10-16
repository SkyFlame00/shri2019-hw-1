module.exports = {
  hostname: 'localhost',
  serverPort: 7000,
  agents: [
    {
      port: 7001
    },
    {
      port: 7002,
      closeConnectionMs: 2000
    },
    {
      port: 7003,
      closeConnectionMs: 13000
    },
    {
      port: 7004
    }
  ]
}