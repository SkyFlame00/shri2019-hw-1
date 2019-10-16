module.exports = (a, b) => {
  const id1 = a.buildId;
  const id2 = b.buildId;

  if (id1 > id2) return -1;
  if (id1 < id2) return 1;
  return 0;
}