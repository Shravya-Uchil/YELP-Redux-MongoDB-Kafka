export function getPageCount(length) {
  let count = 1;
  if (length % 4 == 0) {
    count = length / 4;
  } else {
    count = length / 4 + 1;
  }
  return count;
}

export function getPageObjects(curPage, objects) {
  if (objects && objects.length === 0) {
    return [];
  }
  console.log("paginate");
  let start = 4 * (curPage - 1);
  let end = start + 4;
  console.log("start: ", start, ", end: ", end);
  let displayObjects = [];
  if (end > objects.length) {
    end = objects.length;
  }
  if (start < objects.length) {
    for (start; start < end; start++) {
      displayObjects.push(objects[start]);
    }
  }
  return displayObjects;
}
