import mergeImages from 'merge-images'
import canvas from 'canvas'
import InstanceMap from '../../db/instanceMap.js'
const { Canvas, Image } = canvas

let TILE_DIM = { WIDTH: 32, HEIGHT: 32 }

//Renderer takes in an InstanceMap object as input
export default async (map) => {
  if(!(map instanceof InstanceMap)){
    throw `Map should be of type InstanceMap, not ${typeof(map)}`
  }
  let imgArray = []

  //Build image array from map
  for (let i = 0; i < map.height; i++) {
    for (let j = 0; j < map.width; j++) {
      imgArray.push({
        src: './Assets/Environment/' + map.topography[i][j].type + '.png',
        x: j * TILE_DIM.WIDTH,
        y: i * TILE_DIM.HEIGHT,
      })
    }
  }
  const b64 = await mergeImages(imgArray, {
    width: TILE_DIM.WIDTH * map.width,
    height: TILE_DIM.HEIGHT * map.height,
    Canvas,
    Image,
    format: 'image/png',
  })
  const data = b64.replace(/^data:image\/png;base64,/, '')
  return new Buffer(data, 'base64')
}
