import { range } from 'd3-array';

export default function polygonize (path, numPoints, scale, translateX, translateY) {

  const length = path.getTotalLength();

  return range(numPoints).map(function(i) {
    const point = path.getPointAtLength(length * i / numPoints);
    return [point.x * scale + translateX, point.y * scale + translateY];
  });
}
