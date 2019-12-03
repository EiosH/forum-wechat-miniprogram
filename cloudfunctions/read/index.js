
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var postId = event.postId
  var sum = event.sum
  var err ;
  try {
    return await db.collection('data').doc(postId).update({
      data: {
        reading: sum
      }
    })
  } catch (e) {
    console.log(e)
  }
}
