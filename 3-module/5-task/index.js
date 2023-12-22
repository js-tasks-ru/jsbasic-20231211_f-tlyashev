function getMinMax(str) {
  let numbers = str.split(" ").filter((item) => +item);

  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}
