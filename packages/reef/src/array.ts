export function removeIndexFromArray<T>(array: T[], indexToRemove: number): T[] {
  const a = array.slice(0, indexToRemove);
  const b = array.slice(indexToRemove + 1);
  const newArr = a.concat(b);

  return newArr;
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function getShuffleArray<T>(array: T[]): T[] {
  // Shallow copy of the array
  const newArray = array.slice();

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

export function reverseFilter<T>(
  container: T[],
  filterFn: (content: T) => boolean,
  onlyFirstCoincidence = false
): T[] {
  const result: T[] = [];

  for (let i = container.length - 1; i >= 0; i--) {
    if (filterFn(container[i])) {
      if (onlyFirstCoincidence) return [container[i]];
      result.push(container[i]);
    }
  }

  return result;
}
